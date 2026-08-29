import { ApiResponseModel } from '@shared/models/api-response.model';

export function getApiResponseData<T>(response: ApiResponseModel<T>): T | undefined {
  return response.data;
}

export function getApiResponseMessage<T>(
  response: ApiResponseModel<T>,
): string | string[] | undefined {
  return response.message;
}
