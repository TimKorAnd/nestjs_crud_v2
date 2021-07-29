import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const bearerToken = req.headers?.['authorization'].slice(7); // accessToken from headers bearer
    const userTokensFromRedis = await this.authService.getUserTokensFromRedis(
      payload.sub.toString(),
    );
    if (!userTokensFromRedis) {
      throw new BadRequestException('invalid credentials, login again');
    }
    console.log('req.url');
    console.log(req.url);
    if (bearerToken !== userTokensFromRedis.accessToken) {
      if (
        userTokensFromRedis.refreshToken &&
        bearerToken === userTokensFromRedis.refreshToken
      ) {
        if (req.url === '/auth/refresh') {
          return payload;
        }
        /*await this.authService.renewUserTokensInRedis({
          userId: payload.sub.toString(),
          accessToken: null,
          refreshToken: userTokensFromRedis.refreshToken,
        });
        throw new BadRequestException('refresh credentials'); // maybe refresh oneself?*/
      }
      await this.authService.redisCacheService.del(payload.sub);
      throw new BadRequestException('invalid credentials, login again');
    }

    return payload;
  }
}
