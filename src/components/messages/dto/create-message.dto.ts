import { Length, IsMongoId } from 'class-validator';
import { User } from '../../users/schema/user.schema';
import { Room } from '../../rooms/schema/room.schema';
import { IMessageUpdate } from '../interfaces/message.update.interface';

export class CreateMessageDto implements IMessageUpdate {
  @IsMongoId()
  ownerId: User;
  @IsMongoId()
  roomId: Room;
  @Length(1, 1024)
  text: string;
}
