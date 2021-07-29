import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { IAuthUser } from '../interfaces/auth.user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, pass: string): Promise<IAuthUser> {
    // Promise<boolean> ?
    // here check a parameters email & passwoed
    console.log('local strategy validate');
    return await this.authService.getValidUser(email, pass);
  }
}
