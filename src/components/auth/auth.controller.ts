import {
  Body,
  Controller,
  Get,
  Param,
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
import { IAuthUser } from './interfaces/auth.user';
import { RefreshDto } from './dto/auth.refresh.dto';
import { IAuthUserCleared } from './interfaces/auth.user.cleared';
import { UserByIdPipe } from '../../pipes/user-by-id.pipe';
import { UserWithTokenByRefreshPipe } from '../../pipes/user-with-token-by-refresh.pipe';
import { IAuthUserRefresh } from './interfaces/auth.user.refresh';
import { IAuthUserWithTokens } from './interfaces/auth.user-with-tokens';
import { IAuthUserWithRefreshToken } from './interfaces/auth.user-with-refresh-token';

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
    signup.email = signup.email.toLowerCase();
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
    user?: IAuthUserCleared;
    userId?: string;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = req.user;
    delete req.user; // clear Request object

    console.log('controller signin->login');
    console.log(user);
    return this.authService.signin(user);
  }

  @Get('confirm/:token')
  confirmSignup(@Param('token') token: string) {
    return this.authService.confirmSignup(token);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  getRefreshToken(
    @Body(UserWithTokenByRefreshPipe)
    userWitRefreshToken: IAuthUserWithRefreshToken,
  ) {
    console.log('userWitRefreshToken');
    console.log(userWitRefreshToken);
    return this.authService.refresh(userWitRefreshToken);
  }

  /**
   * For crefensial test only
   * @param req
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }
}
