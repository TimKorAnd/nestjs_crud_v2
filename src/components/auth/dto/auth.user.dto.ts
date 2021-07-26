import {
  IsOptional,
  IsEmail,
  Length,
  IsUrl,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../../users/enums/user.role.enum';
import { UserStatusEnum } from '../../users/enums/user.status.enum';

export class AuthUserDto {
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
  @ApiProperty()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @ApiProperty()
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;
}
