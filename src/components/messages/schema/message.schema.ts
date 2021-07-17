import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schema/user.schema';
import { Room } from '../../rooms/schema/room.schema';
import { Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'messages',
})
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: User;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId: Room;

  @Prop({ type: String, required: true })
  text: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
