import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';
import { MessagesModule } from '../messages/messages.module';
import { configAppRootConfigModule } from './config/config.app.root.cofig.module';
import { configAppMongoConnectionModule } from './config/config.app.mongo.connection.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    configAppRootConfigModule,
    configAppMongoConnectionModule,
    UsersModule,
    RoomsModule,
    MessagesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
