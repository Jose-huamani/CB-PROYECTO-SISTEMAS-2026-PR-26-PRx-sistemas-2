import { HttpParams } from '@angular/common/http';
import { ApiQueryParamsModel } from '@shared/models/api-query-params.model';

export function buildHttpParams(queryParams?: ApiQueryParamsModel): HttpParams {
  if (!queryParams) {
    return new HttpParams();
  }

  let params = new HttpParams();

  for (const [key, value] of Object.entries(queryParams)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        continue;
      }

      for (const item of value) {
        if (item !== null && item !== undefined) {
          params = params.append(key, String(item));
        }
      }

      continue;
    }

    params = params.set(key, String(value));
  }

  return params;
}
