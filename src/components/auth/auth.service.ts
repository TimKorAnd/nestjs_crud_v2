import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { IAuthUser } from './interfaces/auth.user';
import { IAuthUserSignup } from './interfaces/auth.user.signup';
import { UserRoleEnum } from '../users/enums/user.role.enum';
import { UserStatusEnum } from '../users/enums/user.status.enum';
import { MailerService } from '../mailer/mailer.service';
import { RedisCacheService } from '../redis-cache/redis.cache.service';
import { IAuthUserEmail } from './interfaces/auth.user.email';
import { IAuthUserCleared } from './interfaces/auth.user.cleared';
import { IAuthUserWithTokens } from './interfaces/auth.user-with-tokens';
import { IAuthUserWithRefreshToken } from './interfaces/auth.user-with-refresh-token';

@Injectable()
export class AuthService {
  constructor(
    public readonly redisCacheService: RedisCacheService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  /**
   *
   * @param user - valid user existed in DB
   */
  async signin(user: IAuthUser): Promise<IAuthUserWithTokens> {
    const userWithTokens = await this.getClearedUserWithBothNewTokens(user);
    await this.renewUserTokensInRedis(userWithTokens);
    return userWithTokens;
  }

  /**
   * signin call this method through controller login() after DTO validation and LocalGuard verifying
   * @param user - valid user existed in DB
   * @return user cleared from sensitive data with both tokens
   */
  private async getClearedUserWithBothNewTokens(
    user: IAuthUser,
  ): Promise<IAuthUserWithTokens> {
    const tokens = this.getBothNewTokens(user);
    const userCleared: IAuthUserCleared = this.clearUserFromSensitiveData(
      user,
      ['password'],
    );
    return {
      user: userCleared,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  public async renewUserTokensInRedis(
    userWithTokens: IAuthUserWithTokens,
  ): Promise<void> {
    const userId = userWithTokens.user ? userWithTokens.user._id : userWithTokens.userId;
    await this.redisCacheService.del(userId); // TODO del previous? is have sens to verify refresh tokens data if it exist in redis?
    await this.redisCacheService.set(
      userId,
      {
        accessToken: userWithTokens.accessToken,
        refreshToken: userWithTokens.refreshToken,
      },
      {
        ttl: 86400, // sec per 24 hours*/
      },
    );
  }

  private getBothNewTokens(user: IAuthUser): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = {
      sub: user._id,
      role: user.role,
    };
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '1 day',
    }); // TODO how refresh generate?
    payload['email'] = user.email;
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '60s', // 60s - for test. 3600s - 1h for prod.
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  private clearUserFromSensitiveData(
    user: IAuthUser,
    sensitiveDataKeys: string[],
  ): IAuthUserCleared {
    const userCleared = user['_doc'] ? { ...user['_doc'] } : user; // for user which extends mongoose Document
    sensitiveDataKeys.forEach((key) => delete userCleared[key]);
    return userCleared;
  }

  /**
   * when signin call from LocalStrategy for verify existed user in DB and return him as IAuthUser.
   * @param email
   * @param pass
   */
  async getValidUser(email: string, pass: string): Promise<IAuthUser> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException({
        message: `User with email ${email} not found`,
      }); // TODO for test only. Remove email from response
    }
    /*if (user.status !== UserStatusEnum.ACTIVE) {
      throw new BadRequestException({ message: 'Registration not confirmed' });
    }*/
    const isPasswordValid =
      user.password && (await bcrypt.compare(pass, user.password));
    if (!isPasswordValid) {
      throw new BadRequestException({ message: 'Credential are invalid' });
    }
    return user;
  }

  /**
   * call when signup,
   * @param signup
   */
  async signup(signup: IAuthUserSignup) {
    signup['role'] = UserRoleEnum.USER;
    signup['status'] = UserStatusEnum.PENDING;
    const createdUser = await this.usersService.create(signup);
    const payload = {
      sub: createdUser._id,
      email: createdUser.email,
      status: createdUser.status,
    };
    const token = await this.jwtService.sign(payload);
    this.redisCacheService.set(createdUser._id, token, { ttl: 3600 }); // 1 hour for registration confirm
    const userForEmail: IAuthUserEmail = { _id: null, email: '' };
    [userForEmail._id, userForEmail.email] = [
      createdUser._id,
      createdUser.email,
    ];
    return this.sendConfirmation(userForEmail as IAuthUserEmail, token);
  }

  async resend(user: IAuthUser) {
    if (user.status !== UserStatusEnum.PENDING) {
      throw new BadRequestException('user is already active');
    }
    const payload = {
      sub: user._id,
      email: user.email,
      status: user.status,
    };
    const token = await this.jwtService.sign(payload);
    await this.redisCacheService.del(user._id);
    this.redisCacheService.set(user._id, token, { ttl: 3600 }); // 1 hour for registration confirm
    const userForEmail: IAuthUserEmail = { _id: null, email: '' };
    [userForEmail._id, userForEmail.email] = [user._id, user.email];
    return this.sendConfirmation(userForEmail as IAuthUserEmail, token);
  }

  private sendConfirmation(createdUser: IAuthUserEmail, token: string) {
    this.mailerService.send(createdUser, token);
    return true;
  }

  async confirmSignup(mailToken: string) {
    let mailTokenPayload;
    try {
      mailTokenPayload = await this.jwtService.verify(mailToken);
    } catch (error) {
      // for user w/o verbose information
      return 'link is incorrect';
    }
    if (!mailTokenPayload.email || !mailTokenPayload.sub) {
      // anti hack actions needed
      return 'confirm fail; first signup need';
    }
    const redisPendingToken = await this.redisCacheService.get(
      mailTokenPayload.sub,
    );
    const userFromDB = await this.usersService.findOneByEmail(
      mailTokenPayload.email,
    );
    if (userFromDB.status !== UserStatusEnum.PENDING) {
      return 'you registration is already confirmed';
    }
    if (!redisPendingToken) {
      return 'time for confirm is out, signup again';
    }
    if (redisPendingToken !== mailToken) {
      return 'confirm fail';
    }
    if (userFromDB && userFromDB._id.toString() === mailTokenPayload.sub) {
      // signup is successful
      userFromDB.status = UserStatusEnum.ACTIVE;
      await userFromDB.save();
      this.redisCacheService.del(mailTokenPayload.sub);
      // send onboarding email wit congrats for signin
      return ' congrats for confirm your signup';
    } else {
      // signup is fail
      return 'confirm failed, signup is not complete. try later';
    }
  }

  /*async refreshOld(userWitRefreshToken: IAuthUserWithRefreshToken) {
    const validTokensFromRedis = await this.getUserTokensFromRedis(
      userWitRefreshToken.user._id.toString(),
    );
    const validRefreshTokenFromRedis: string = validTokensFromRedis.refreshToken;
    if (userWitRefreshToken.token !== validRefreshTokenFromRedis) {
      throw new BadRequestException('credentials are insufficient for refresh');
    }
    return this.signin(userWitRefreshToken.user);
  }*/

  async refresh(userId: string, email: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || user.email !== email) {
      await this.redisCacheService.del(userId);
      throw new BadRequestException('invalid credentials, login required');
    }
    return this.signin(user as IAuthUser);
  }

  getUserTokensFromRedis(userId: string) {
    return this.redisCacheService.get(userId);
  }
}
