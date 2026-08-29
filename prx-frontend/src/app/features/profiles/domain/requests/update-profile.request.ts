import { ProfileSocialNetworkRequest } from '@features/profiles/domain/requests/profile-social-network.request';
import { TagRequest } from '@features/profiles/domain/requests/tag.request';

export interface UpdateProfileRequest {
  firstName?: string | null;
  lastName?: string | null;
  secondLastName?: string | null;
  biography?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  countryId?: number | null;
  regionName?: string | null;
  townName?: string | null;
  phoneCodeId?: number | null;
  isEmailVisible?: boolean;
  socialNetworks?: ProfileSocialNetworkRequest[];
  tags?: TagRequest[];
}
