import { CurrentUserModel } from '@shared/models/current-user.model';

export interface AuthModel {
  accessToken: string;
  refreshToken: string;
  user: CurrentUserModel;
}
