import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { configAuthJwt } from './config/cofig.auth.jwt.module';
import { HttpModule } from '@nestjs/axios';
import { MailerModule } from '../mailer/mailer.module';
import { MailerService } from '../mailer/mailer.service';
import { RedisCacheModule } from '../redis-cache/redis.cache.module';

@Module({
  imports: [
    RedisCacheModule,
    HttpModule,
    UsersModule,
    PassportModule,
    ConfigModule,
    configAuthJwt,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, MailerService],
  exports: [AuthService],
})
export class AuthModule {}
