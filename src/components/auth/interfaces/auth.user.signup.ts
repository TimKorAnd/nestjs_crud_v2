import { Types, Document } from 'mongoose';
import { Room } from '../../rooms/schema/room.schema';
import * as mongoose from 'mongoose';
import { UserRoleEnum } from '../../users/enums/user.role.enum';
import { UserStatusEnum } from '../../users/enums/user.status.enum';

export interface IAuthUserSignup extends Document {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  password: string;
  avatarUrl?: string;
  role?: UserRoleEnum;
  status?: UserStatusEnum;
}
