/*import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { UsersService } from '../components/users/users.service';
import { Types } from 'mongoose';
import { UserEntity } from '../components/users/entities/user.entity';
import { User } from '../components/users/schema/user.schema';

@Injectable()
export class UserByIdPipe implements PipeTransform<Types.ObjectId, UserEntity> {
  constructor(private readonly usersService: UsersService) {}

  transform(value: Types.ObjectId, metadata: ArgumentMetadata) {
    return this.usersService.findOne(value);
  }
}*/
