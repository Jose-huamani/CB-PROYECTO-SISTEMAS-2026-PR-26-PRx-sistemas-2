import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { GetSocialNetworksHandler } from '@modules/social-networks/application/queries/get-social-networks/get-social-networks.handler';
import { SocialNetworksController } from '@modules/social-networks/presentation/controllers/social-networks.controller';
import { SocialNetworkRepository } from '@modules/social-networks/domain/repositories/social-network.repository';
import { PrismaSocialNetworkRepository } from '@modules/social-networks/infrastructure/persistence/prisma-social-network.repository';

@Module({
    imports: [CqrsModule],
    controllers: [SocialNetworksController],
    providers: [
        GetSocialNetworksHandler,
        {
            provide: SocialNetworkRepository,
            useClass: PrismaSocialNetworkRepository,
        },
    ],
})
export class SocialNetworksModule { }
