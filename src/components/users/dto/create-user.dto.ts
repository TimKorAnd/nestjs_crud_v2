import { IsEmail, Length, IsDataURI, IsMongoId } from 'class-validator';

export class CreateUserDto {
  @Length(3, 30)
  name: string;
  @IsEmail()
  email: string;
  @Length(6, 30)
  password: string;
  @IsDataURI()
  avatarUrl: string;
  @IsMongoId()
  roomId: string;
}
