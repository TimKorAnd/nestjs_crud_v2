import { Length, IsMongoId } from 'class-validator';
import { User } from '../../users/schema/user.schema';
import { Room } from '../../rooms/schema/room.schema';
import { IMessage } from '../interfaces/message.interface';

export class CreateMessageDto implements IMessage {
  @IsMongoId()
  ownerId: User;
  @IsMongoId()
  roomId: Room;
  @Length(1, 1024)
  text: string;
}
