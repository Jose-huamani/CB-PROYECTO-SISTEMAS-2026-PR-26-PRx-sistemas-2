import { RepositoryVisibility } from '@shared/enums/repository-visibility.enum';
import { CurrentUserModel } from '@shared/models/current-user.model';

import { RepositoryCategoryModel } from './repository-category.model';
import { RepositoryFunctionModel } from './repository-function.model';
import { RepositoryRoleModel } from './repository-role.model';
import { RepositoryTagModel } from './repository-tag.model';

export interface RepositoryModel {
  id: number;
  repositoryCategoryId: number;
  ownerUserId: number;
  name: string;
  visibility: RepositoryVisibility;
  color: string;
  description?: string | null;
  category: RepositoryCategoryModel;
  owner: CurrentUserModel;
  tags: RepositoryTagModel[];
  currentUserRepository?: {
    role: RepositoryRoleModel;
    function: RepositoryFunctionModel;
  } | null;
  createdAt: string;
  updatedAt: string;
}
