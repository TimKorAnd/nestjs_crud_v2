import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { Types } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import { IMessage } from './interfaces/message.interface';

@Injectable()
export class MessagesService {
  static populateFields = ['ownerId', 'roomId'];
  constructor(
    @InjectModel(Message.name) private messageModel: Model<IMessage>,
  ) {}

  create(createMessageDto: CreateMessageDto) {
    return this.messageModel.create(createMessageDto);
  }

  findAll(): Promise<IMessage[]> {
    return this.messageModel
      .find()
      .populate(MessagesService.populateFields)
      .lean()
      .exec();
  }

  findOne(id: Types.ObjectId): Promise<IMessage> {
    return this.messageModel
      .findOne(id)
      .populate(MessagesService.populateFields)
      .lean()
      .exec();
  }

  update(id: Types.ObjectId, update: IMessage): Promise<IMessage> {
    return this.messageModel
      .findOneAndUpdate(id, { $set: update }, { new: true })
      .populate(MessagesService.populateFields)
      .lean()
      .exec();
  }

  remove(id: Types.ObjectId): Promise<any> {
    return this.messageModel.deleteOne({ _id: id }).lean().exec();
  }

  findAllByField(field: IMessage): Promise<IMessage[]> {
    return this.messageModel
      .find(field)
      .populate(MessagesService.populateFields)
      .lean()
      .exec();
  }
}
