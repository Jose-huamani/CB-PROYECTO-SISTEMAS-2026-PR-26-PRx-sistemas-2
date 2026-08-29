import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseFeatureApi } from '@core/api/base-feature.api';
import { ProfileModel } from '@features/profiles/domain/models/profile.model';
import { UpdateProfileRequest } from '@features/profiles/domain/requests/update-profile.request';
import { PROFILE_API_CONFIG } from '@features/profiles/infrastructure/config/profile-api.config';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { CountryModel } from '@features/profiles/domain/models/country.model';
import { TagModel } from '@features/profiles/domain/models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileApi extends BaseFeatureApi {
  private readonly publicHttp: HttpClient;

  constructor(http: HttpClient, httpBackend: HttpBackend) {
    super(http, PROFILE_API_CONFIG.base);
    this.publicHttp = new HttpClient(httpBackend);
  }

  getProfile(): Observable<ApiResponseModel<ProfileModel>> {
    return this.get<ProfileModel>(this.buildUrl());
  }

  getPublicProfile(id: number): Observable<ApiResponseModel<ProfileModel>> {
    return this.publicHttp.get<ApiResponseModel<ProfileModel>>(
      this.buildUrl(PROFILE_API_CONFIG.endpoints.public.replace(':id', id.toString())),
    );
  }

  getCountries(): Observable<ApiResponseModel<CountryModel[]>> {
    return this.publicHttp.get<ApiResponseModel<CountryModel[]>>(
      this.buildUrl(PROFILE_API_CONFIG.endpoints.countries),
    );
  }

  getTags(search?: string): Observable<ApiResponseModel<TagModel[]>>;
  getTags(data: { search?: string; limit?: number }): Observable<ApiResponseModel<TagModel[]>>;
  getTags(searchOrData?: string | { search?: string; limit?: number }): Observable<ApiResponseModel<TagModel[]>> {
    return this.get<TagModel[]>(this.buildUrl(PROFILE_API_CONFIG.endpoints.tags), {
      search: typeof searchOrData === 'string' ? searchOrData : searchOrData?.search,
      limit: typeof searchOrData === 'string' ? 20 : searchOrData?.limit,
    });
  }

  createProfile(data: UpdateProfileRequest): Observable<ApiResponseModel<ProfileModel>> {
    return this.post<ProfileModel>(this.buildUrl(PROFILE_API_CONFIG.endpoints.create), data);
  }

  updateProfile(data: UpdateProfileRequest): Observable<ApiResponseModel<ProfileModel>> {
    return this.patch<ProfileModel>(this.buildUrl(), data);
  }

  updateAvatar(file: File): Observable<ApiResponseModel<ProfileModel>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.patch<ProfileModel>(this.buildUrl(PROFILE_API_CONFIG.endpoints.avatar), formData);
  }
}
