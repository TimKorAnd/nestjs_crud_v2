import { IsEmail, IsMongoId, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUserUpdate } from '../interfaces/user.update.interface';

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
}
