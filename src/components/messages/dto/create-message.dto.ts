import { Length, IsMongoId } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId()
  ownerId: string;
  @IsMongoId()
  roomId: string;
  @Length(1, 1024)
  text: string;
}
