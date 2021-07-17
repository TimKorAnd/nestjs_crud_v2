import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { UsersService } from '../components/users/users.service';
import { Types } from 'mongoose';
import { User } from '../components/users/entities/user.entity';

@Injectable()
export class UserByIdPipe implements PipeTransform<Types.ObjectId, User> {
  constructor(private readonly usersService: UsersService) {}

  transform(value: Types.ObjectId, metadata: ArgumentMetadata) {
    return this.usersService.findOne(value);
  }
}
