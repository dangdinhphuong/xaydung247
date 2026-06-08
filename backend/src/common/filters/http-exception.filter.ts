import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const body = exception.getResponse();
    const payload: { code?: string; message?: unknown } =
      typeof body === 'object' ? (body as any) : { message: body };

    if (status >= 500) {
      this.logger.error(
        `${req.method} ${req.url} ${status} ${exception.message}`,
        exception.stack,
      );
    }

    res.status(status).json({
      statusCode: status,
      code: payload.code,
      message: payload.message ?? exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
