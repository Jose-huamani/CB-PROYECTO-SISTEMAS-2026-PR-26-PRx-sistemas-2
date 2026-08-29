import { SocialNetworkEntity } from '@modules/social-networks/domain/entities/social-network.entity';

export abstract class SocialNetworkRepository {
    abstract findAll(): Promise<SocialNetworkEntity[]>;
}
