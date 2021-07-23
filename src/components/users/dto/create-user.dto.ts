import { IsOptional, IsEmail, Length, IsUrl, IsMongoId } from 'class-validator';
import { Room } from '../../rooms/schema/room.schema';
import { IUser } from '../interfaces/user.interface';
import { Types } from 'mongoose';

export class CreateUserDto {
  @Length(3, 30)
  name: string;
  @IsEmail()
  email: string;
  @Length(6, 30)
  password: string;
  @IsUrl()
  @Length(3, 30)
  @IsOptional()
  avatarUrl?: string;
  @IsMongoId()
  roomId: Room; // TODO if set string type, than Dto not compatible with IUserUpdate (controller  to service)
}
// TODO remove fields which are not used for user create
