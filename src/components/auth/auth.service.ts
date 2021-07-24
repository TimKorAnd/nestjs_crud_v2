import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { IAuthLoginInput } from './interfaces/auth-login.input';
import { IUserReturned } from '../users/interfaces/user.returned.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(userSignIn: IAuthLoginInput) {
    console.log('userSignIn');
    console.log(userSignIn);
    const userFromDB: IUserReturned = await this.usersService.findOneByEmail(
      userSignIn.email,
    ); // TODO can we return user from guard for decrease DB query? YES!
    console.log('userFromDB:');
    console.log(userFromDB);
    if (userFromDB) {
      const payload = {
        sub: userFromDB._id,
        email: userFromDB.email,
        role: userFromDB.role,
      };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload); // TODO how refresh generate?
      return {
        user: userFromDB,
        accessToken,
        refreshToken,
      };
    }
    throw new NotFoundException('User not found');
  }

  /*async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }*/

  // async validateUser(email: string, pass: string): Promise<boolean> {
  async validateUser(email: string, pass: string): Promise<any> {
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
    //return true;
    //return user;
    const { password, ...result } = user;
    return result;
  }
}
