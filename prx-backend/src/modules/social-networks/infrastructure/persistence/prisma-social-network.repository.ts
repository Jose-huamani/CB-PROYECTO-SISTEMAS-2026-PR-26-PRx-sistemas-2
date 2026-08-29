import { Injectable } from '@nestjs/common';

import { BasePrismaRepository } from '@shared/infrastructure/persistence/base-prisma.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

import { SocialNetworkEntity } from '@modules/social-networks/domain/entities/social-network.entity';
import { SocialNetworkRepository } from '@modules/social-networks/domain/repositories/social-network.repository';
import { SocialNetworkPrismaMapper } from '@modules/social-networks/infrastructure/mappers/social-network-prisma.mapper';

@Injectable()
export class PrismaSocialNetworkRepository
    extends BasePrismaRepository
    implements SocialNetworkRepository {
    constructor(prisma: PrismaService) {
        super(prisma);
    }

    async findAll(): Promise<SocialNetworkEntity[]> {
        const socialNetworks = await this.prisma.socialNetwork.findMany({
            where: { status: 1 },
            orderBy: { name: 'asc' },
        });

        return SocialNetworkPrismaMapper.toDomainList(socialNetworks as any);
    }
}
