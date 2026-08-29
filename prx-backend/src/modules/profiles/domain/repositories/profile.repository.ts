import { ProfileEntity } from '@modules/profiles/domain/entities/profile.entity';
import { RepositoryPort } from '@shared/domain/repository.port';

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type ProfileUpdateInput = Omit<Partial<Mutable<ProfileEntity>>, 'socialNetworks'> & {
  socialNetworks?: Array<{
    socialNetworkId: number;
    username: string;
  }>;
  regionId?: number | null;
  townId?: number | null;
  regionName?: string | null;
  townName?: string | null;
  secondLastName?: string | null;
};

export abstract class ProfileRepository extends RepositoryPort<ProfileEntity> {
  abstract findByUserId(userId: number): Promise<ProfileEntity | null>;
  abstract update(id: number, data: ProfileUpdateInput): Promise<ProfileEntity>;
}
