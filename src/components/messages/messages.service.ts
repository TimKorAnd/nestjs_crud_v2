import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Types } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  create(createMessageDto: CreateMessageDto) {
    return this.messageModel.create(createMessageDto);
  }

  findAll() {
    return this.messageModel
      .find()
      .populate(['ownerId', 'roomId'])
      .lean()
      .exec();
  }

  findOne(id: Types.ObjectId) {
    return this.messageModel
      .findOne(id)
      .populate(['ownerId', 'roomId'])
      .lean()
      .exec();
  }

  update(id: Types.ObjectId, updateMessageDto: UpdateMessageDto) {
    return this.messageModel
      .findOneAndUpdate(id, { updateMessageDto }, { new: true })
      .lean()
      .exec();
  }

  remove(id: Types.ObjectId) {
    return this.messageModel.deleteOne(id).lean().exec();
  }
}
