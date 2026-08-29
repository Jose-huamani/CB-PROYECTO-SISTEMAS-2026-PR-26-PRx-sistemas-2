import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponseDto } from '@shared/application/dto/api-response.dto';
import { APP_MESSAGES } from '@shared/constants/app-messages.constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const path = request.url;
    const timestamp = new Date().toISOString();

    let message: string | string[] = APP_MESSAGES.INTERNAL_ERROR;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      message =
        (exceptionResponse as { message?: string | string[] }).message ??
        message;
    }

    const responseBody: ApiResponseDto<null> = {
      success: false,
      statusCode: status,
      message,
      timestamp,
      path,
    };

    response.status(status).json(responseBody);
  }
}
