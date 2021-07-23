import {
  IsAlphanumeric,
  IsArray,
  IsMongoId,
  IsOptional,
  Length,
} from 'class-validator';
import { User } from '../../users/schema/user.schema';
import { IRoom } from '../interfaces/room.interface';

export class UpdateRoomDto {
  @IsOptional()
  @Length(6, 30)
  @IsAlphanumeric()
  title: string;
  @IsOptional()
  @IsMongoId()
  ownerId: User;
  @IsOptional()
  @Length(6, 30)
  description: string;
  @IsOptional()
  @IsArray()
  usersId: User[];
}
