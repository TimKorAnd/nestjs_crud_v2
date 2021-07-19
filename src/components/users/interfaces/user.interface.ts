import { Types } from 'mongoose';
import { Room } from '../../rooms/schema/room.schema';

export interface IUser {
  name?: string;
  email?: string;
  password?: string;
  avatarUrl?: string;
  roomId?: Room | Types.ObjectId | string;
}
