import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { SocialNetworkRepository } from '@modules/social-networks/domain/repositories/social-network.repository';
import { SocialNetworkResponseMapper } from '@modules/social-networks/application/mappers/social-network-response.mapper';
import { GetSocialNetworksQuery } from './get-social-networks.query';

@QueryHandler(GetSocialNetworksQuery)
export class GetSocialNetworksHandler implements IQueryHandler<GetSocialNetworksQuery> {
    constructor(
        @Inject(SocialNetworkRepository)
        private readonly socialNetworkRepository: SocialNetworkRepository,
    ) { }

    async execute() {
        const socialNetworks = await this.socialNetworkRepository.findAll();

        return {
            data: SocialNetworkResponseMapper.toSocialNetworkResponseList(socialNetworks),
        };
    }
}
