import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Room } from '../../rooms/schema/room.schema';
import * as mongoose from 'mongoose';
import { UserStatusEnum } from '../enums/user.status.enum';
import { UserRoleEnum } from '../enums/user.role.enum';

export type UserDocument = User & Document;

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ type: String, default: 'anon' })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, default: null, isOptional: true })
  avatarUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null })
  roomId: Room;

  @Prop({
    type: String,
    enum: Object.values(UserStatusEnum),
    default: UserStatusEnum.PENDING,
  })
  status: string;

  @Prop({
    type: String,
    enum: Object.values(UserRoleEnum),
    default: UserRoleEnum.USER,
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
