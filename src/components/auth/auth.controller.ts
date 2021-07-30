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
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { PATH_METADATA } from '@nestjs/common/constants';
import { app } from '../../main';
import { MailerService } from '../mailer/mailer.service';
import { IAuthUserWithTokens } from './interfaces/auth.user-with-tokens';
import { SignUpDto } from './dto/auth.signup.dto';

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
  async signup(@Body() signup: SignUpDto): Promise<boolean> {
    signup.email = signup.email.toLowerCase();
    return this.authService.signup(signup);
  }

  @Post('/signin')
  async signin(@Body() signin: SignInDto) {
    const appUrl = await app.getUrl();
    const authControllerUrl = Reflect.getMetadata(
      PATH_METADATA,
      AuthController,
    );
    const loginRouteUrl = `${appUrl}/${authControllerUrl}/login`;
    return this.httpService
      .post(loginRouteUrl, signin)
      .pipe(map((response) => response.data));
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): Promise<IAuthUserWithTokens> {
    const user = req.user;
    delete req.user; // clear Request object
    return this.authService.signin(user);
  }

  @Get('confirm/:token')
  confirmSignup(@Param('token') token: string) {
    return this.authService.confirmSignup(token);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/resend')
  resend(@Request() req): Promise<boolean> {
    const user = req.user;
    delete req.user; // clear Request object
    return this.authService.resend(user);
  }

  /*  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  getRefreshToken(
    @Body(UserWithTokenByRefreshPipe)
    userWitRefreshToken: IAuthUserWithRefreshToken,
  ) {
    return this.authService.refreshOld(userWitRefreshToken);
  }*/

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  getRefreshToken(@Request() req, @Body('email') email: string) {
    return this.authService.refresh(req.user.sub, email);
  }

  /**
   * For credential test only
   * @param req
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }
}
