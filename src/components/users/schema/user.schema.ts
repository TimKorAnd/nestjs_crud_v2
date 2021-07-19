import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Room } from '../../rooms/schema/room.schema';
import { IUser } from '../interfaces/user.interface';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'users',
})
export class User implements IUser {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, default: null, isOptional: true })
  avatarUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  roomId: Room;
}

export const UserSchema = SchemaFactory.createForClass(User);
