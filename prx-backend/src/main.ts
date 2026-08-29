import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { buildSwaggerConfig } from '@config/swagger.config';
import { HttpExceptionFilter } from '@shared/presentation/filters/http-exception.filter';
import { TransformResponseInterceptor } from '@shared/presentation/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.getOrThrow<number>('app.port');
  const apiPrefix = configService.getOrThrow<string>('app.apiPrefix');

  app.setGlobalPrefix(apiPrefix);
  app.enableCors();
  app.use(helmet());
  app.use(compression());
  app.set('trust proxy', true);
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  const swaggerConfig = buildSwaggerConfig(configService);
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(port, '0.0.0.0');

  console.log(`Application running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`Swagger running on: http://localhost:${port}/docs`);
}

bootstrap();
