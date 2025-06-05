import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger, WinstonModule } from 'nest-winston';
import { loggerConfig } from './logger.config';
import { ValidationPipe } from '@nestjs/common';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const configService = app.get<ConfigService>(ConfigService);
  const logger = app.get<WinstonLogger>(WINSTON_MODULE_NEST_PROVIDER);
  await app.listen(configService.get('PORT') ?? 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}
