import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

@Module({
  imports: [
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>('SENDGRID_API_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
