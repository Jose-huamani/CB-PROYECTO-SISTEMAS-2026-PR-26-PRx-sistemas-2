import { CreateRepositoryCategoryRequest } from '@features/repositories/domain/requests/create-repository-category.request';
import { CreateRepositoryTagRequest } from '@features/repositories/domain/requests/create-repository-tag.request';
import { RepositoryVisibility } from '@shared/enums/repository-visibility.enum';

export interface CreateRepositoryRequest {
  name: string;
  description?: string;
  visibility: RepositoryVisibility;
  color: string;
  category: CreateRepositoryCategoryRequest;
  tags?: CreateRepositoryTagRequest[];
}
