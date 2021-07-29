import { Types } from 'mongoose';
import { Room } from '../../rooms/schema/room.schema';
import { UserRoleEnum } from '../../users/enums/user.role.enum';
import { UserStatusEnum } from '../../users/enums/user.status.enum';

export interface IAuthUser {
  _id: Types.ObjectId;
  name: string;
  password: string;
  email: string;
  avatarUrl: string;
  roomId: Room | Types.ObjectId;
  role: UserRoleEnum;
  status: UserStatusEnum;
}
