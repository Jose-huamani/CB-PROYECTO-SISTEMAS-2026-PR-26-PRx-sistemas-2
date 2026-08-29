import { CurrentUserModel } from '@shared/models/current-user.model';

import { RepositoryFunctionModel } from './repository-function.model';
import { RepositoryModel } from './repository.model';
import { RepositoryRoleModel } from './repository-role.model';

export interface RepositoryUserModel {
  id: number;
  repositoryId: number;
  userId: number;
  repositoryRoleId: number;
  repositoryFunctionId: number;
  repository?: RepositoryModel;
  user?: CurrentUserModel;
  role: RepositoryRoleModel;
  function: RepositoryFunctionModel;
  createdAt: string;
  updatedAt: string;
}
