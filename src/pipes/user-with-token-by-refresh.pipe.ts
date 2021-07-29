import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { UsersService } from '../components/users/users.service';
import { Types } from 'mongoose';
import { isEmptyOrNull } from '../helpers/is-empty-obj.helper';
import { IAuthUserRefresh } from '../components/auth/interfaces/auth.user.refresh';
import { IAuthUser } from '../components/auth/interfaces/auth.user';
import { IUserReturned } from '../components/users/interfaces/user.returned.interface';
import { IAuthUserWithRefreshToken } from '../components/auth/interfaces/auth.user-with-refresh-token';

@Injectable()
export class UserWithTokenByRefreshPipe implements PipeTransform<IAuthUserRefresh, Promise<IAuthUserWithRefreshToken>> {
  constructor(private readonly usersService: UsersService) {}

  async transform(
    value: IAuthUserRefresh,
    metadata: ArgumentMetadata,
  ): Promise<IAuthUserWithRefreshToken> {
    console.log('pipe refresh');
    if (!value || !value.userId || !value.token) {
      throw new BadRequestException('wrong Body! use DTO for validate !!!');
    }
    const user = await this.usersService.findOne(Types.ObjectId(value.userId));
    console.log(user);
    if (isEmptyOrNull(user)) {
      throw new BadRequestException('user is not found');
    }
    return {
      user: user as IAuthUser,
      token: value.token,
    };
  }
}
