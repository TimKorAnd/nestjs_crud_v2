import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schema/user.schema';
import * as mongoose from 'mongoose';
import { IRoom } from '../interfaces/room.interface';

export type RoomDocument = Room & Document;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'rooms',
})
export class Room {
  @Prop({ type: String, required: true, unique: true })
  title: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  ownerId: User;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  usersId: [User];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
