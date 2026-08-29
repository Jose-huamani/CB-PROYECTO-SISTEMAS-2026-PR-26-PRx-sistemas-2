import { SocialNetworkEntity } from '@modules/social-networks/domain/entities/social-network.entity';

type SocialNetworkPrismaModel = {
    id: number;
    name: string;
    baseUrl: string;
    icon: string;
    status: number;
};

export class SocialNetworkPrismaMapper {
    static toDomain(socialNetwork: SocialNetworkPrismaModel): SocialNetworkEntity {
        return new SocialNetworkEntity(
            socialNetwork.id,
            socialNetwork.name,
            socialNetwork.baseUrl,
            socialNetwork.icon,
            socialNetwork.status,
        );
    }

    static toDomainList(socialNetworks: SocialNetworkPrismaModel[]): SocialNetworkEntity[] {
        return socialNetworks.map((socialNetwork) => this.toDomain(socialNetwork));
    }
}
