import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
} from '@nestjs/terminus';
import { Role } from '@generated-prisma/enums';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { MailHealthIndicator } from '@modules/health/application/indicators/mail-health.indicator';
import { PrismaHealthIndicator } from '@modules/health/application/indicators/prisma-health.indicator';
import { StorageHealthIndicator } from '@modules/health/application/indicators/storage-health.indicator';
import { Public } from '@shared/presentation/decorators/public.decorator';
import { Roles } from '@shared/presentation/decorators/roles.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly prismaHealthIndicator: PrismaHealthIndicator,
    private readonly mailHealthIndicator: MailHealthIndicator,
    private readonly storageHealthIndicator: StorageHealthIndicator,
  ) {}

  @Public()
  @Get('live')
  @HttpCode(HttpStatus.OK)
  @HealthCheck()
  @ApiOperation({
    summary: 'Verificar que la API está en ejecución',
    description:
      'Comprueba únicamente que la aplicación NestJS responde a solicitudes HTTP.',
  })
  checkLive(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([]);
  }

  @Public()
  @Get('ready')
  @HttpCode(HttpStatus.OK)
  @HealthCheck()
  @ApiOperation({
    summary: 'Verificar que la API está lista para operar',
    description:
      'Comprueba que la aplicación responde y que la base de datos está disponible.',
  })
  checkReady(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.prismaHealthIndicator.isHealthy('database'),
    ]);
  }

  @Roles(Role.metaadministrador)
  @Get('dependencies')
  @HttpCode(HttpStatus.OK)
  @HealthCheck()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Diagnosticar dependencias externas del backend',
    description:
      'Comprueba base de datos, SMTP y acceso a los buckets público y privado de Tigris. Disponible únicamente para metaadministradores.',
  })
  checkDependencies(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.prismaHealthIndicator.isHealthy('database'),
      () => this.mailHealthIndicator.isHealthy('mail'),
      () => this.storageHealthIndicator.isHealthy('storagePublic', true),
      () => this.storageHealthIndicator.isHealthy('storagePrivate', false),
    ]);
  }
}
