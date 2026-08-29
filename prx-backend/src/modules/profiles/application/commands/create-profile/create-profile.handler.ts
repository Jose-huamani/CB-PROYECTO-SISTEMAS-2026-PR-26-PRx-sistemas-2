import { ConflictException, Inject } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProfileResponseMapper } from '@modules/profiles/application/mappers/profile-response.mapper';
import { ProfileRepository } from '@modules/profiles/domain/repositories/profile.repository';
import { CreateProfileCommand } from '@modules/profiles/application/commands/create-profile/create-profile.command';
import { ProfileEntity } from '@modules/profiles/domain/entities/profile.entity';
import { PROFILE_MESSAGES } from '@modules/profiles/application/constants/profile-messages.constants';
import { RegionRepository } from '@modules/profiles/domain/repositories/region.repository';
import { TownRepository } from '@modules/profiles/domain/repositories/town.repository';
import { UpdateTagsCommand } from '@modules/profiles/application/commands/update-tags/update-tags.command';

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler implements ICommandHandler<CreateProfileCommand> {
  constructor(
    @Inject(ProfileRepository)
    private readonly profileRepository: ProfileRepository,
    @Inject(RegionRepository)
    private readonly regionRepository: RegionRepository,
    @Inject(TownRepository)
    private readonly townRepository: TownRepository,
    private readonly commandBus: CommandBus,
  ) { }

  async execute(command: CreateProfileCommand) {
    const existing = await this.profileRepository.findByUserId(
      command.createdBy,
    );

    if (existing) {
      throw new ConflictException(PROFILE_MESSAGES.ALREADY_EXISTS);
    }

    const data = command.data;
    const tags = data.tags;

    let regionId: number | null = null;
    let townId: number | null = null;

    if (data.regionName) {
      const region = await this.regionRepository.findOrCreateByName(
        data.regionName.toUpperCase(),
      );
      regionId = region.id!;
    }

    if (data.townName) {
      const town = await this.townRepository.findOrCreateByName(
        data.townName.toUpperCase(),
      );
      townId = town.id!;
    }
    const profile = new ProfileEntity(
      command.createdBy,
      data.firstName ?? null,
      data.lastName ?? null,
      data.secondLastName ?? null,
      data.biography ?? null,
      data.phoneNumber ?? null,
      command.email,
      null,
      data.countryId ?? null,
      regionId,
      townId,
      data.phoneCodeId ?? null,
      data.isEmailVisible ?? false,
      (data.socialNetworks || []).map((s) => ({
        id: 0,
        profileId: 0,
        socialNetworkId: s.socialNetworkId,
        username: s.username,
        status: 1,
      })),
      [],
      command.createdBy,
    );

    const created = await this.profileRepository.create(profile);

    if (tags !== undefined) {
      await this.commandBus.execute(
        new UpdateTagsCommand(created.id!, tags, command.createdBy),
      );
    }

    const refreshedProfile = await this.profileRepository.findById(created.id!);

    return {
      message: PROFILE_MESSAGES.CREATED,
      data: ProfileResponseMapper.toProfileResponse(refreshedProfile ?? created),
    };
  }
}
