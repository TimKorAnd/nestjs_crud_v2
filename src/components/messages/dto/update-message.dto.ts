import { IsMongoId, IsOptional, Length } from 'class-validator';
import { Room } from '../../rooms/schema/room.schema';
import { IMessageUpdate } from '../interfaces/message.update.interface';

export class UpdateMessageDto implements IMessageUpdate {
  @IsOptional()
  @IsMongoId()
  roomId: Room;
  @IsOptional()
  @Length(1, 1024)
  text: string;
}
