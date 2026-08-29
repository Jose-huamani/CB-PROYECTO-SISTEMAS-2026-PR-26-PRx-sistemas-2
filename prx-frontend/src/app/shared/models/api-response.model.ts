export interface ApiResponseModel<T> {
  success: boolean;
  statusCode: number;
  message?: string | string[];
  data?: T;
  timestamp: string;
  path?: string;
}
