import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiQueryParamsModel } from '@shared/models/api-query-params.model';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { buildHttpParams } from '@shared/utils/http-params.util';

export abstract class BaseApi {
  protected constructor(protected readonly http: HttpClient) {}

  protected get<T>(
    url: string,
    queryParams?: ApiQueryParamsModel,
  ): Observable<ApiResponseModel<T>> {
    return this.http.get<ApiResponseModel<T>>(url, this.buildRequestOptions(queryParams));
  }

  protected post<T>(
    url: string,
    body: unknown,
    queryParams?: ApiQueryParamsModel,
  ): Observable<ApiResponseModel<T>> {
    return this.http.post<ApiResponseModel<T>>(url, body, this.buildRequestOptions(queryParams));
  }

  protected patch<T>(
    url: string,
    body: unknown,
    queryParams?: ApiQueryParamsModel,
  ): Observable<ApiResponseModel<T>> {
    return this.http.patch<ApiResponseModel<T>>(url, body, this.buildRequestOptions(queryParams));
  }

  protected delete<T>(
    url: string,
    queryParams?: ApiQueryParamsModel,
  ): Observable<ApiResponseModel<T>> {
    return this.http.delete<ApiResponseModel<T>>(url, this.buildRequestOptions(queryParams));
  }

  private buildRequestOptions(queryParams?: ApiQueryParamsModel): {
    params: ReturnType<typeof buildHttpParams>;
  } {
    return {
      params: buildHttpParams(queryParams),
    };
  }
}
