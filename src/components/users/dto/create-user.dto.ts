import { IsOptional, IsEmail, Length, IsUrl, IsMongoId } from 'class-validator';
import { Room } from '../../rooms/schema/room.schema';
import { IUser } from '../interfaces/user.interface';
import { Types } from 'mongoose';

export class CreateUserDto implements IUser {
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
  roomId: Types.ObjectId;
}
