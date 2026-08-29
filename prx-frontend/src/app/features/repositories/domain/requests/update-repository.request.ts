import { CreateRepositoryRequest } from '@features/repositories/domain/requests/create-repository.request';

export type UpdateRepositoryRequest = Partial<CreateRepositoryRequest>;
