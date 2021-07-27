import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { IAuthUserReturned } from './interfaces/auth.user.returned.interface';
import { IAuthUserSignup } from './interfaces/auth.user.signup';
import { UserRoleEnum } from '../users/enums/user.role.enum';
import { UserStatusEnum } from '../users/enums/user.status.enum';
import { MailerService } from '../mailer/mailer.service';
import { RedisCacheService } from '../redis-cashe/redis.cache.service';
import { IAuthUserEmail } from './interfaces/auth.user.email';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisCacheService: RedisCacheService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async getUserWithTokensForLogin(user: IAuthUserReturned) {
    const payload = {
      sub: user._id,
      role: user.role,
    };
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '1 day',
    }); // TODO how refresh generate?
    this.redisCacheService.set(user._id, refreshToken, { ttl: 5184000 }); // sec per 24 hours
    payload['email'] = user.email;
    const accessToken = this.jwtService.sign(payload);
    console.log('verify');
    console.log(this.jwtService.verify(refreshToken));
    console.log(this.jwtService.verify(accessToken));
    return {
      user: user,
      accessToken,
      refreshToken,
    };
  }

  async getValidUser(email: string, pass: string): Promise<IAuthUserReturned> {
    console.log('service validateUser');
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException({
        message: `User with email ${email} not found`,
      }); // TODO for test only. Remove email from response
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException({ message: 'Credential are invalid' });
    }
    const { password, ...result } = user;
    return result as IAuthUserReturned;
  }

  async signup(signup: Partial<IAuthUserSignup>) {
    signup['role'] = UserRoleEnum.USER;
    signup['status'] = UserStatusEnum.PENDING;
    const createdUser = await this.usersService.create(signup);
    const payload = {
      sub: createdUser._id,
      email: createdUser.email,
      status: createdUser.status,
    };
    const token = await this.jwtService.sign(payload);
    this.redisCacheService.set(createdUser._id, token, { ttl: 3600 }); // 1 hour for registration
    const userForEmail = { _id: null, email: '' };
    [userForEmail._id, userForEmail.email] = [
      createdUser._id,
      createdUser.email,
    ];
    return this.sendConfirmation(userForEmail as IAuthUserEmail, token);
  }

  private sendConfirmation(createdUser: IAuthUserEmail, token: string) {
    this.mailerService.send(createdUser, token);
    return true;
  }

  async confirmSignup(mailToken: string) {
    console.log(mailToken);
    const mailTokenPayload = await this.jwtService.verify(mailToken);
    console.log('mailTokenPayload ');
    console.log(mailTokenPayload);
    console.log(mailTokenPayload.sub);
    // const redisPendingToken = await this.redisCacheService.get(mailTokenPayload?.sub);
    const redisPendingToken = await this.redisCacheService.get(
      mailTokenPayload?.sub,
    ); // whatever delete
    console.log('redisPendingToken ' + redisPendingToken);
    const userFromDB = await this.usersService.findOneByEmail(
      mailTokenPayload?.email,
    );
    console.log('userFromDB ');
    console.log(userFromDB);
    if (
      redisPendingToken === mailToken &&
      userFromDB._id.toString() === mailTokenPayload.sub
    ) {
      // signup is succes
      userFromDB.status = UserStatusEnum.ACTIVE;
      userFromDB.save();
      this.redisCacheService.del(mailTokenPayload.sub);
      // send onboarding email wit congrats for signin
      return this.getUserWithTokensForLogin(userFromDB as IAuthUserReturned);
    } else {
      // signup fail
      console.log('signup fail');
    }
  }
}
