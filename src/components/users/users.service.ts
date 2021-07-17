import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  findAll() {
    return this.userModel.find().populate('roomId').lean().exec();
  }

  findOne(id: Types.ObjectId) {
    return this.userModel.findOne(id).populate('roomId').lean().exec();
  }

  update(id: Types.ObjectId, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findOneAndUpdate(id, { updateUserDto }, { new: true })
      .lean()
      .exec();
  }

  remove(id: Types.ObjectId) {
    return this.userModel.deleteOne(id).lean().exec();
  }
}
