import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';
import { MessagesModule } from '../messages/messages.module';
import { configModule } from '../../configure/config.root';
import { configMongoConnection } from '../../configure/config.mongo.connection';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    configModule,
    configMongoConnection,
    UsersModule,
    RoomsModule,
    MessagesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
