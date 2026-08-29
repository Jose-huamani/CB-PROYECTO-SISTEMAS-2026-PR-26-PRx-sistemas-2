import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { MailHealthIndicator } from '@modules/health/application/indicators/mail-health.indicator';
import { PrismaHealthIndicator } from '@modules/health/application/indicators/prisma-health.indicator';
import { StorageHealthIndicator } from '@modules/health/application/indicators/storage-health.indicator';
import { HealthController } from '@modules/health/presentation/controllers/health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [
    PrismaHealthIndicator,
    MailHealthIndicator,
    StorageHealthIndicator,
  ],
})
export class HealthModule {}
