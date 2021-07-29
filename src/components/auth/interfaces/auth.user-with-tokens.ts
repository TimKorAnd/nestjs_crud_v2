import { IAuthUserCleared } from './auth.user.cleared';

export interface IAuthUserWithTokens {
  user?: IAuthUserCleared;
  userId?: string;
  accessToken: string;
  refreshToken: string;
}
