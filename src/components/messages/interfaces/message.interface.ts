import { User } from '../../users/schema/user.schema';
import { Room } from '../../rooms/schema/room.schema';
import { Types, Document } from 'mongoose';

export interface IMessage extends Document {
  _id: Types.ObjectId;
  ownerId: User | Types.ObjectId | string;
  roomId: Room | Types.ObjectId;
  text: string;
}
