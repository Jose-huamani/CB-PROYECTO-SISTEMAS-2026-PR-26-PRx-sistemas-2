import { CreateBinnacleHandler } from '@modules/binnacles/application/commands/create-binnacle/create-binnacle.handler';
import { DeleteBinnacleHandler } from '@modules/binnacles/application/commands/delete-binacle/delete-binnacle.handler';
import { GetMeBinnaclesHandler } from '@modules/binnacles/application/queries/get-me-binnacles/get-me-binnacles.handler';
import { BinnacleRepository } from '@modules/binnacles/domain/repositories/binnacle.repository';
import { PrismaBinnacleRepository } from '@modules/binnacles/infrastructure/persistence/prisma-binnacle.repository';
import { BinnaclesController } from '@modules/binnacles/presentation/controllers/binnacles.controllers';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [BinnaclesController],
  providers: [
    CreateBinnacleHandler,
    DeleteBinnacleHandler,
    GetMeBinnaclesHandler,
    {
      provide: BinnacleRepository,
      useClass: PrismaBinnacleRepository,
    },
  ],
  exports: [BinnacleRepository],
})
export class BinnaclesModule {}
