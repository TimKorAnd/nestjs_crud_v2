import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Room } from '../../rooms/schema/room.schema';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, default: null })
  avatarUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Room' })
  roomId: Room;
}

export const UserSchema = SchemaFactory.createForClass(User);
