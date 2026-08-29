import { Observable } from 'rxjs';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { ProfileModel } from '@features/profiles/domain/models/profile.model';
import { UpdateProfileRequest } from '@features/profiles/domain/requests/update-profile.request';
import { CountryModel } from '@features/profiles/domain/models/country.model';
import { TagModel } from '@features/profiles/domain/models/tag.model';

export interface ProfileApiContract {
  getProfile(): Observable<ApiResponseModel<ProfileModel>>;
  getPublicProfile(id: number): Observable<ApiResponseModel<ProfileModel>>;
  getCountries(): Observable<ApiResponseModel<CountryModel[]>>;
  getTags(search?: string): Observable<ApiResponseModel<TagModel[]>>;
  updateProfile(data: UpdateProfileRequest): Observable<ApiResponseModel<ProfileModel>>;
  updateAvatar(file: File): Observable<ApiResponseModel<ProfileModel>>;
}
