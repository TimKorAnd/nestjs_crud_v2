import { Types } from 'mongoose';
import { Room } from '../../rooms/schema/room.schema';
import * as mongoose from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  name?: string;
  email?: string;
  password?: string;
  avatarUrl?: string;
  roomId?: Room | Types.ObjectId;
}
