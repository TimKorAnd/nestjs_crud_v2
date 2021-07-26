import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/auth.signin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthUserDto } from './dto/auth.user.dto';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { PATH_METADATA } from '@nestjs/common/constants';
import { app } from '../../main';
import { MailerService } from '../mailer/mailer.service';
import { IAuthUserReturned } from './interfaces/auth.user.returned.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('/signup')
  async signup(@Body() signup: SignInDto) {
    return this.authService.signup(signup);
  }

  @Post('/signin')
  async signin(@Body() signin: SignInDto) {
    const loginRouteUrl =
      (await app.getUrl()) +
      '/' +
      Reflect.getMetadata(PATH_METADATA, AuthController) +
      '/login';
    return this.httpService
      .post(loginRouteUrl, signin)
      .pipe(map((response) => response.data));
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): Promise<{
    user: IAuthUserReturned;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = req.user;
    delete req.user; // clear Request obj

    console.log('controller signin');
    console.log(user);
    return this.authService.getUserWithTokensForLogin(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req.user);
    console.log(req.payload);
    return req.user;
  }
}
