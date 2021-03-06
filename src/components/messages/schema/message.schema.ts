import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schema/user.schema';
import { Room } from '../../rooms/schema/room.schema';
import * as mongoose from 'mongoose';
import { IMessage } from '../interfaces/message.interface';

export type MessageDocument = Message & Document;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'messages',
})
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  ownerId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true })
  roomId: Room;

  @Prop({ type: String, required: true })
  text: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
