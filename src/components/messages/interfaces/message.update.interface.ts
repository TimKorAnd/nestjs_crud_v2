import { User } from '../../users/schema/user.schema';
import { Room } from '../../rooms/schema/room.schema';
import { Types } from 'mongoose';

export interface IMessageUpdate {
  _id?: Types.ObjectId;
  ownerId?: User | Types.ObjectId | string;
  roomId?: Room | Types.ObjectId;
  text?: string;
}
