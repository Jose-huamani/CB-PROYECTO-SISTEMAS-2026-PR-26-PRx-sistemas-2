import { Injectable } from '@nestjs/common';

import { CountryRepository } from '@modules/profiles/domain/repositories/country.repository';
import { BasePrismaRepository } from '@shared/infrastructure/persistence/base-prisma.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { CountryModel } from '@generated-prisma/models/Country';

@Injectable()
export class PrismaCountryRepository
  extends BasePrismaRepository
  implements CountryRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findAll(): Promise<CountryModel[]> {
    return this.prisma.country.findMany({
      where: { status: 1 },
      orderBy: { name: 'asc' },
      include: { phoneCodes: true },
    });
  }
}
