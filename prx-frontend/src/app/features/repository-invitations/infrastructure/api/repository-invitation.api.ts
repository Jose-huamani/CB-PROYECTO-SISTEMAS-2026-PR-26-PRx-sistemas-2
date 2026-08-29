import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseFeatureApi } from '@core/api/base-feature.api';
import { RepositoryInvitationApiContract } from '@features/repository-invitations/domain/contracts/repository-invitation-api.contract';
import { RepositoryInvitationModel } from '@features/repository-invitations/domain/models/repository-invitation.model';
import { CreateRepositoryInvitationRequest } from '@features/repository-invitations/domain/requests/create-repository-invitation.request';
import { REPOSITORY_INVITATION_API_CONFIG } from '@features/repository-invitations/infrastructure/config/repository-invitation-api.config';
import { ApiResponseModel } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class RepositoryInvitationApi
  extends BaseFeatureApi
  implements RepositoryInvitationApiContract
{
  constructor(http: HttpClient) {
    super(http, REPOSITORY_INVITATION_API_CONFIG.base);
  }

  create(
    repositoryId: number,
    request: CreateRepositoryInvitationRequest,
  ): Observable<ApiResponseModel<RepositoryInvitationModel>> {
    return this.post<RepositoryInvitationModel>(
      this.buildUrl(
        REPOSITORY_INVITATION_API_CONFIG.endpoints.create.replace(
          ':repositoryId',
          repositoryId.toString(),
        ),
      ),
      request,
    );
  }

  findById(id: number): Observable<ApiResponseModel<RepositoryInvitationModel>> {
    return this.get<RepositoryInvitationModel>(
      this.buildUrl(
        REPOSITORY_INVITATION_API_CONFIG.endpoints.findById.replace(':id', id.toString()),
      ),
    );
  }

  accept(id: number): Observable<ApiResponseModel<void>> {
    return this.patch<void>(
      this.buildUrl(
        REPOSITORY_INVITATION_API_CONFIG.endpoints.accept.replace(':id', id.toString()),
      ),
      {},
    );
  }

  reject(id: number): Observable<ApiResponseModel<void>> {
    return this.patch<void>(
      this.buildUrl(
        REPOSITORY_INVITATION_API_CONFIG.endpoints.reject.replace(':id', id.toString()),
      ),
      {},
    );
  }
}
