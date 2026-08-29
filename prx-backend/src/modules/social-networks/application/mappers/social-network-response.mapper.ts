import { SocialNetworkResponseDto } from '@modules/social-networks/application/dto/responses/social-network-response.dto';
import { SocialNetworkEntity } from '@modules/social-networks/domain/entities/social-network.entity';

export class SocialNetworkResponseMapper {
    static toSocialNetworkResponse(socialNetwork: SocialNetworkEntity): SocialNetworkResponseDto {
        return {
            id: socialNetwork.id as number,
            name: socialNetwork.name,
            baseUrl: socialNetwork.baseUrl,
            icon: socialNetwork.icon,
        };
    }

    static toSocialNetworkResponseList(
        socialNetworks: SocialNetworkEntity[],
    ): SocialNetworkResponseDto[] {
        return socialNetworks.map((socialNetwork) => this.toSocialNetworkResponse(socialNetwork));
    }
}
