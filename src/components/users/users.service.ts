import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { Types } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { IUser } from './interfaces/user.interface';
import { Room } from '../rooms/schema/room.schema';
//import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  static populateFields = [{ path: 'roomId', model: Room }];
  constructor(@InjectModel(User.name) private userModel: Model<IUser>) {}

  create(createUserDto: CreateUserDto): Promise<IUser> {
    return this.userModel.create(createUserDto);
  }

  findAll(field?: IUser): Promise<IUser[]> {
    return this.userModel
      .find(field)
      .populate(UsersService.populateFields)
      .lean()
      .exec();
  }

  findOne(id: Types.ObjectId): Promise<IUser> {
    return this.userModel
      .findOne(id)
      .populate(UsersService.populateFields)
      .lean()
      .exec();
  }

  update(
    id: Types.ObjectId,
    update: IUser,
    options: { new: boolean } = { new: true },
    populateParams: any[] = UsersService.populateFields,
  ): Promise<IUser> {
    return this.userModel
      .findOneAndUpdate({ _id: id }, { $set: update }, options)
      .populate(UsersService.populateFields)
      .lean()
      .exec();
  }

  remove(id: Types.ObjectId): Promise<any> {
    return this.userModel.deleteOne({ _id: id }).lean().exec();
  }
}
