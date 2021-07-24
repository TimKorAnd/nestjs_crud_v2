import { IsOptional, IsEmail, Length, IsUrl, IsMongoId } from 'class-validator';
import { Room } from '../../rooms/schema/room.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IUserUpdate } from '../interfaces/user.update.interface';

export class CreateUserDto {
  @ApiProperty()
  @Length(3, 30)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(6, 30)
  password: string;

  @ApiProperty()
  @IsUrl()
  @Length(3, 30)
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty()
  @IsMongoId()
  roomId: string; /* TODO if set string type, than Dto not compatible with IUserUpdate (controller  to service),
                     and there need add 'string'   roomId?: Room | Types.ObjectId | string;. */
}
// TODO remove fields which are not used for user create
