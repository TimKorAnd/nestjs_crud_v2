import { Types } from 'mongoose';
import { User } from '../../users/schema/user.schema';

export interface IRoomUpdate {
  _id?: Types.ObjectId;
  title?: string;
  ownerId?: User | Types.ObjectId | string;
  description?: string;
  usersId?: User[] | Types.ObjectId[];
}
