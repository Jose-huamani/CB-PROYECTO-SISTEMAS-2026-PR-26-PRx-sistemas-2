import { Injectable } from '@nestjs/common';

import { TagEntity } from '@modules/tags/domain/entities/tag.entity';
import { TagRepository } from '@modules/tags/domain/repositories/tag.repository';
import { TagPrismaMapper } from '@modules/tags/infrastructure/mappers/tag-prisma.mapper';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaTagRepository implements TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateByName(name: string): Promise<TagEntity | null> {
    const tag = await this.prisma.tag.findUnique({
      where: {
        name,
      },
    });

    if (tag && tag.status === 1) {
      return TagPrismaMapper.toDomain(tag);
    }

    if (tag && tag.status === 0) {
      return null;
    }

    const createdTag = await this.prisma.tag.create({
      data: {
        name,
      },
    });

    return TagPrismaMapper.toDomain(createdTag);
  }
}
