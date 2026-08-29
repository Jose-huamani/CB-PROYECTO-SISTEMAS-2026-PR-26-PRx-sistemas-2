import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { ApiResponseDto } from '@shared/application/dto/api-response.dto';

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponseDto<unknown>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponseDto<unknown>> {
    const http = context.switchToHttp();
    const response = http.getResponse();
    const request = http.getRequest();

    return next.handle().pipe(
      map((data: T) => {
        let message: string | string[] | undefined;
        let responseData: unknown = undefined;

        if (data && typeof data === 'object' && !Array.isArray(data)) {
          const maybeData = data as Record<string, unknown>;

          const hasMessage = 'message' in maybeData;
          const hasData = 'data' in maybeData;

          if (hasMessage) {
            message = maybeData.message as string | string[] | undefined;
          }

          if (hasData) {
            responseData = maybeData.data;
          } else if (!hasMessage) {
            responseData = data;
          }
        } else {
          responseData = data;
        }

        const responseBody: ApiResponseDto<unknown> = {
          success: true,
          statusCode: response.statusCode,
          message,
          data: responseData,
          path: request.url,
          timestamp: new Date().toISOString(),
        };

        return responseBody;
      }),
    );
  }
}
