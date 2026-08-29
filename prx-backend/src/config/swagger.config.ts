import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';

export const buildSwaggerConfig = (config: ConfigService) =>
  new DocumentBuilder()
    .setTitle(config.getOrThrow<string>('app.name'))
    .setDescription('API documentation for PRX backend')
    .setVersion(config.getOrThrow<string>('app.version'))
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Ingresa el access token',
    })
    .build();
