import { Types, Document } from 'mongoose';
import { User } from '../../users/schema/user.schema';

export interface IRoom extends Document {
  _id: Types.ObjectId;
  title: string;
  ownerId: User | Types.ObjectId | string;
  description: string;
  usersId: User[] | Types.ObjectId[];
}
