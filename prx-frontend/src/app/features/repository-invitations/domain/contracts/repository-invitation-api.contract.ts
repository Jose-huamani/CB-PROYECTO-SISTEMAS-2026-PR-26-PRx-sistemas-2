import { Observable } from 'rxjs';

import { RepositoryInvitationModel } from '@features/repository-invitations/domain/models/repository-invitation.model';
import { CreateRepositoryInvitationRequest } from '@features/repository-invitations/domain/requests/create-repository-invitation.request';
import { ApiResponseModel } from '@shared/models/api-response.model';

export abstract class RepositoryInvitationApiContract {
  abstract create(
    repositoryId: number,
    request: CreateRepositoryInvitationRequest,
  ): Observable<ApiResponseModel<RepositoryInvitationModel>>;

  abstract findById(id: number): Observable<ApiResponseModel<RepositoryInvitationModel>>;

  abstract accept(id: number): Observable<ApiResponseModel<void>>;

  abstract reject(id: number): Observable<ApiResponseModel<void>>;
}
