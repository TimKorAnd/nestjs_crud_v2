import { IsEmail, IsEnum, IsMongoId, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUserUpdate } from '../interfaces/user.update.interface';
import { UserRoleEnum } from '../enums/user.role.enum';
import { UserStatusEnum } from '../enums/user.status.enum';

export class UpdateUserDto implements IUserUpdate {
  @ApiProperty()
  @Length(3, 30)
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @Length(6, 30)
  password?: string;

  @ApiProperty()
  @IsOptional()
  @Length(3, 30)
  avatarUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  roomId?: string;

  @ApiProperty()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @ApiProperty()
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;
}
