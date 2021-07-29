import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { RoomsService } from '../components/rooms/rooms.service';
import { Types } from 'mongoose';
//import { User } from '../components/users/entities/user.entity';

@Injectable()
export class RoomByIdPipe implements PipeTransform<Types.ObjectId> {
  constructor(private readonly roomsService: RoomsService) {}

  async transform(value: Types.ObjectId, metadata: ArgumentMetadata) {
    const room = await this.roomsService.findOne(value);
    if (!room) {
      throw new BadRequestException('room is not found');
    }
    return room;
  }
}
