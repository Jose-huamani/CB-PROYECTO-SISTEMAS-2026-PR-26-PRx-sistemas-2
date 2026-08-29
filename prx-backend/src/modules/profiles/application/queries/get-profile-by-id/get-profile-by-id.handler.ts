import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ProfileResponseMapper } from '@modules/profiles/application/mappers/profile-response.mapper';
import { ProfileRepository } from '@modules/profiles/domain/repositories/profile.repository';
import { GetProfileByIdQuery } from '@modules/profiles/application/queries/get-profile-by-id/get-profile-by-id.query';
import { PROFILE_MESSAGES } from '@modules/profiles/application/constants/profile-messages.constants';

@QueryHandler(GetProfileByIdQuery)
export class GetProfileByIdHandler implements IQueryHandler<GetProfileByIdQuery> {
  constructor(
    @Inject(ProfileRepository)
    private readonly profileRepository: ProfileRepository,
  ) { }

  async execute(query: GetProfileByIdQuery) {
    const profile = await this.profileRepository.findById(query.id);

    if (!profile) {
      throw new NotFoundException(PROFILE_MESSAGES.NOT_FOUND);
    }

    return {
      data: ProfileResponseMapper.toProfileResponse(profile),
    };
  }
}
