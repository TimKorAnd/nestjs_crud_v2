import { IsMongoId, IsOptional, Length } from 'class-validator';
import { Room } from '../../rooms/schema/room.schema';
import { IRoom } from '../../rooms/interfaces/room.interface';
import { IMessage } from '../interfaces/message.interface';

export class UpdateMessageDto implements IMessage {
  @IsOptional()
  @IsMongoId()
  roomId: Room;
  @IsOptional()
  @Length(1, 1024)
  text: string;
}
