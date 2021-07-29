import { ConfigModule } from '@nestjs/config';

export const configAppRootConfigModule = ConfigModule.forRoot({
  envFilePath: `.env.${process.env.NODE_ENV || 'development.secret'}`, // change to development.local
  isGlobal: true,
});
