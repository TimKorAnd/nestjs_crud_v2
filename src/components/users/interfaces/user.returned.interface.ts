import { Types } from 'mongoose';
import { Room } from '../../rooms/schema/room.schema';
import * as mongoose from 'mongoose';
import { UserRoleEnum } from '../enums/user.role.enum';
import { UserStatusEnum } from '../enums/user.status.enum';

export interface IUserReturned {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  password: string;
  avatarUrl?: string;
  roomId?: Room | Types.ObjectId;
  role?: UserRoleEnum;
  status?: UserStatusEnum;
}
