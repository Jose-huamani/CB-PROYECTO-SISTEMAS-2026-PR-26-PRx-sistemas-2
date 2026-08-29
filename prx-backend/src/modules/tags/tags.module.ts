import { Module } from '@nestjs/common';

import { TagRepository } from '@modules/tags/domain/repositories/tag.repository';
import { PrismaTagRepository } from '@modules/tags/infrastructure/persistence/prisma-tag.repository';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: TagRepository,
      useClass: PrismaTagRepository,
    },
  ],
  exports: [TagRepository],
})
export class TagsModule {}
