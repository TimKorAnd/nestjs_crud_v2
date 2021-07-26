import { Types } from 'mongoose';
import { Room } from '../../rooms/schema/room.schema';
import { UserRoleEnum } from '../../users/enums/user.role.enum';
import { UserStatusEnum } from '../../users/enums/user.status.enum';
import { IUserReturned } from '../../users/interfaces/user.returned.interface';

export interface IAuthUserEmail {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  role?: UserRoleEnum;
  status?: UserStatusEnum;
}
