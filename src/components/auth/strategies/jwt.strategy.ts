import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    if (req.url === '/auth/refresh') {
      if (
        userTokensFromRedis.refreshToken &&
        bearerToken === userTokensFromRedis.refreshToken
      ) {
        return payload; // when bearer contains redis-actual refresh token && request came from refresh token only
      }
      await this.authService.redisCacheService.del(payload.sub);
      throw new BadRequestException('invalid credentials, login again');
    }
    // if bearer has no redis-actual access token - clear redisTokens & re-login require
    if (bearerToken !== userTokensFromRedis.accessToken) {
      await this.authService.redisCacheService.del(payload.sub);
      throw new BadRequestException('invalid credentials, login again');
    }

    return payload;
  }
}
