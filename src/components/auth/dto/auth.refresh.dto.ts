import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsMongoId, Length } from 'class-validator';

export class RefreshDto {
  @ApiProperty()
  @IsMongoId()
  userId: string;

  @ApiProperty()
  @IsBase64()
  @Length(24)
  token: string;
}
