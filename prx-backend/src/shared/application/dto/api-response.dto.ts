export class ApiResponseDto<T> {
  success!: boolean;
  statusCode!: number;
  message?: string | string[];
  data?: T;
  timestamp!: string;
  path?: string;
}
