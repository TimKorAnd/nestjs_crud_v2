import { IsEmail, IsMongoId, IsOptional, Length } from 'class-validator';
import { Room } from '../../rooms/schema/room.schema';
import { IUser } from '../interfaces/user.interface';
import { Types } from 'mongoose';

export class UpdateUserDto {
  @Length(3, 30)
  @IsOptional()
  name?: string;
  @IsOptional()
  @Length(6, 30)
  password?: string;
  @IsOptional()
  @Length(3, 30)
  avatarUrl?: string;
  @IsOptional()
  @IsMongoId()
  roomId?: string;
}
