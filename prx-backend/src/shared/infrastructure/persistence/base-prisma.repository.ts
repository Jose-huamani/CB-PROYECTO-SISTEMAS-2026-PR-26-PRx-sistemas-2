import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

export abstract class BasePrismaRepository {
  protected constructor(protected readonly prisma: PrismaService) {}
}
