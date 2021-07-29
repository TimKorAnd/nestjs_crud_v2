import { IAuthUser } from './auth.user';

export interface IAuthUserWithRefreshToken {
  user: IAuthUser;
  token: string;
}
