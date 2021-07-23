import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { Types } from 'mongoose';
import { Room } from './schema/room.schema';
import { User } from '../users/schema/user.schema';
import { IRoom } from './interfaces/room.interface';
import { IRoomReturned } from './interfaces/room.returned.interface';
import { IRoomUpdate } from './interfaces/room.update.interface';

@Injectable()
export class RoomsService {
  static populateFields = [
    { path: 'usersId', model: User },
    { path: 'ownerId', model: User },
  ];
  constructor(@InjectModel(Room.name) private roomModel: Model<IRoom>) {}

  create(create: IRoomUpdate): Promise<IRoomReturned> {
    return this.roomModel.create(create);
  }

  findAll(field?: IRoomUpdate): Promise<IRoomReturned[]> {
    return this.roomModel
      .find(field)
      .populate(RoomsService.populateFields)
      .lean()
      .exec();
  }

  findOne(id: Types.ObjectId): Promise<IRoomReturned> {
    return this.roomModel
      .findOne(id)
      .populate(RoomsService.populateFields)
      .lean()
      .exec();
  }

  update(id: Types.ObjectId, update: IRoomUpdate): Promise<IRoomReturned> {
    return this.roomModel
      .findOneAndUpdate({ _id: id }, { $set: update }, { new: true })
      .populate(RoomsService.populateFields)
      .lean()
      .exec();
  }

  remove(id: Types.ObjectId): Promise<any> {
    return this.roomModel.deleteOne({ _id: id }).lean().exec();
  }

  addUserToRoom(
    userId: Types.ObjectId,
    roomId: Types.ObjectId,
  ): Promise<IRoomReturned> {
    return this.roomModel
      .findOneAndUpdate(
        { _id: roomId },
        { $addToSet: { usersId: userId } },
        { new: true },
      )
      .lean()
      .exec();
  }

  async leaveUserFromRoom(
    userId: Types.ObjectId,
    roomId: Types.ObjectId,
  ): Promise<IRoomReturned> {
    return this.roomModel
      .findOneAndUpdate(
        { _id: roomId },
        { $pull: { usersId: userId } },
        { new: true },
      )
      .lean()
      .exec();
  }
}
