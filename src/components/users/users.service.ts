import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { IUser } from './interfaces/user.interface';
import { Room } from '../rooms/schema/room.schema';
import { IUserReturned } from './interfaces/user.returned.interface';
import { IUserUpdate } from './interfaces/user.update.interface';

@Injectable()
export class UsersService {
  static populateFields = [{ path: 'roomId', model: Room }];
  constructor(@InjectModel(User.name) private userModel: Model<IUser>) {}

  async create(create: IUserUpdate): Promise<IUserReturned> {
    const passwordHash = await this.getPasswordHash(create.password);
    return this.userModel.create({ ...create, password: passwordHash });
  }

  // TODO remove to module Token or like Crypto
  private async getPasswordHash(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  findAll(field?: IUserUpdate): Promise<IUserReturned[]> {
    return this.userModel
      .find(field)
      .populate(UsersService.populateFields)
      .lean()
      .exec();
  }

  findOneByEmail(email: string): Promise<IUser> {
    return this.userModel.findOne({ email }).exec();
  }

  findOne(id: Types.ObjectId | string): Promise<IUserReturned> {
    id = (typeof id === 'string') ? Types.ObjectId(id) : id;
    return this.userModel
      .findOne(id)
      .populate(UsersService.populateFields)
      .lean()
      .exec();
  }

  findOneDocument(id: Types.ObjectId): Promise<IUser> {
    return this.userModel
      .findOne({ _id: id })
      .populate(UsersService.populateFields)
      .exec();
  }

  update(
    id: Types.ObjectId,
    update: IUserUpdate,
    options: { new: boolean } = { new: true },
    populateParams: any[] = UsersService.populateFields,
  ): Promise<any> {
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
