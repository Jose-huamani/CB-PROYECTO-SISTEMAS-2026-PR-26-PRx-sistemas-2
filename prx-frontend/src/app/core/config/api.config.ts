import { environment } from '@env/environment';

export const API_CONFIG = {
  baseUrl: environment.api.baseUrl,
  timeout: environment.api.timeout,
} as const;
