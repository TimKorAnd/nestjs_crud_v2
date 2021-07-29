import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { UsersService } from '../components/users/users.service';
import { Types } from 'mongoose';
import { isEmptyOrNull } from '../helpers/is-empty-obj.helper';
//import { User } from '../components/users/entities/user.entity';

@Injectable()
export class UserByIdPipe implements PipeTransform<Types.ObjectId> {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: Types.ObjectId, metadata: ArgumentMetadata) {
    const user = await this.usersService.findOneDocument(value);
    if (isEmptyOrNull(user)) {
      throw new BadRequestException('user is not found');
    }
    return user;
  }
}
