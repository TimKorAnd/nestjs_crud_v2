import {
  IsArray,
  IsAlphanumeric,
  MaxLength,
  Length,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomDto {
  @Length(6, 30)
  @IsAlphanumeric()
  title: string;
  @IsMongoId()
  ownerId: string;
  @Length(6, 30)
  description: string;
  @IsArray()
  usersId: string[];
}
