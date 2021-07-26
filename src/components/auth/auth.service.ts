import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { IAuthUserReturned } from './interfaces/auth.user.returned.interface';
import { IAuthUserSignup } from './interfaces/auth.user.signup';
import { UserRoleEnum } from '../users/enums/user.role.enum';
import { UserStatusEnum } from '../users/enums/user.status.enum';
import { IAuthUserCreated } from './interfaces/auth.user.created';
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
    };
    const token = await this.jwtService.sign(payload);
    //const { password, ...userForEmail } = createdUser; // TODO clear sensitive fields via...
    const userForEmail = createdUser;
    return this.sendConfirmation(userForEmail as IAuthUserEmail, token);
  }

  private sendConfirmation(createdUser: IAuthUserEmail, token: string) {
    this.mailerService.send(createdUser, token);
    return true;
  }
}
