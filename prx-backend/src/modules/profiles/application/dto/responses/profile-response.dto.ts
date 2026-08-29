import { ProfileSocialNetworkEntity } from '@modules/profiles/domain/entities/profile-social-network.entity';
import { TagResponseDto } from '@modules/tags/application/dto/responses/tag-response.dto';

export class ProfileResponseDto {
  id!: number;
  userId!: number;
  email!: string | null;
  firstName!: string | null;
  lastName!: string | null;
  secondLastName!: string | null;
  biography!: string | null;
  phoneNumber!: string | null;
  avatarUrl!: string | null;
  countryId!: number | null;
  countryName?: string | null;
  countryPhoneCode?: string | null;
  regionId!: number | null;
  regionName?: string | null;
  townId!: number | null;
  townName?: string | null;
  phoneCodeId!: number | null;
  isEmailVisible!: boolean;
  socialNetworks!: ProfileSocialNetworkEntity[];
  tags!: TagResponseDto[];
  createdAt!: Date;
  updatedAt!: Date;
}
