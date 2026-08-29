import { Role } from '@shared/enums/role.enum';

export interface CurrentUserModel {
  id: number;
  email: string;
  username: string;
  role: Role;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}
