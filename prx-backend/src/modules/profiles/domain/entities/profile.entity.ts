import { ProfileSocialNetworkEntity } from '@modules/profiles/domain/entities/profile-social-network.entity';
import { TagProfileEntity } from '@modules/profiles/domain/entities/tag-profile.entity';
import { AuditableEntity } from '@shared/domain/auditable.entity';

export class ProfileEntity extends AuditableEntity {
  constructor(
    id: number | null,
    public readonly firstName: string | null,
    public readonly lastName: string | null,
    public readonly secondLastName: string | null,
    public readonly biography: string | null,
    public readonly phoneNumber: string | null,
    public readonly email: string | null,
    public readonly avatarUrl: string | null,
    public readonly countryId: number | null,
    public readonly regionId: number | null,
    public readonly townId: number | null,
    public readonly phoneCodeId: number | null,
    public readonly isEmailVisible: boolean,
    public readonly socialNetworks: ProfileSocialNetworkEntity[] = [],
    public readonly tagProfiles: TagProfileEntity[] = [],
    createdBy: number,
    public readonly countryName?: string | null,
    public readonly regionName?: string | null,
    public readonly townName?: string | null,
    status?: number,
    createdAt?: Date,
    updatedAt?: Date,
    updatedBy?: number,
  ) {
    super(id, createdBy, status, createdAt, updatedAt, updatedBy);
  }
}
