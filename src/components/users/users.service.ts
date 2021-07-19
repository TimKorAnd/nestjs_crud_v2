import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { Types } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { IUser } from './interfaces/user.interface';
//import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<IUser>) {}

  create(createUserDto: CreateUserDto): Promise<IUser> {
    return this.userModel.create(createUserDto);
  }

  findAll(): Promise<IUser[]> {
    return this.userModel.find().populate('roomId').lean().exec();
  }

  findOne(id: Types.ObjectId): Promise<IUser> {
    return this.userModel.findOne(id).populate('roomId').lean().exec();
  }

  update(
    id: Types.ObjectId,
    update: IUser,
    options: { new: boolean } = { new: true },
  ): Promise<IUser> {
    return this.userModel
      .findOneAndUpdate({ _id: id }, { $set: update }, options)
      .populate('roomId')
      .lean()
      .exec();
  }

  remove(id: Types.ObjectId): Promise<any> {
    return this.userModel.deleteOne({ _id: id }).lean().exec();
  }
}
