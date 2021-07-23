import { IsArray, IsAlphanumeric, Length, IsMongoId } from 'class-validator';
import { User } from '../../users/schema/user.schema';
import { IRoom } from '../interfaces/room.interface';

export class CreateRoomDto {
  @Length(6, 30)
  @IsAlphanumeric()
  title: string;
  @IsMongoId()
  ownerId: User;
  @Length(6, 30)
  description: string;
  @IsArray()
  usersId: User[];
}
