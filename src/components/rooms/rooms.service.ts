import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Types } from 'mongoose';
import { Room, RoomDocument } from './schema/room.schema';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  create(createRoomDto: CreateRoomDto) {
    return this.roomModel.create(createRoomDto);
  }

  findAll() {
    return `This action returns all rooms`;
  }

  findOne(id: Types.ObjectId): Promise<RoomDocument> {
    return this.roomModel.findOne(id).populate('usersId').exec();
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
