import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as rTracer from 'cls-rtracer';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: WinstonLogger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl: url } = req;
    const requestId = rTracer.id() ?? 'no-id';

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse<Response>();
        const statusCode = res.statusCode;

        this.logger.log(
          `[${requestId as string}] [${method}] ${url} - ${statusCode} - ${Date.now() - now}ms`,
          'HTTP Request',
        );
      }),
    );
  }
}
