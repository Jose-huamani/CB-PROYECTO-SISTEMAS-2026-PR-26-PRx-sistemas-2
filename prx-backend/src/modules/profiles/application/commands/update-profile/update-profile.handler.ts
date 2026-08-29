import { Inject, NotFoundException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ProfileResponseMapper } from '@modules/profiles/application/mappers/profile-response.mapper';
import { ProfileRepository } from '@modules/profiles/domain/repositories/profile.repository';
import { UpdateProfileCommand } from '@modules/profiles/application/commands/update-profile/update-profile.command';
import { PROFILE_MESSAGES } from '@modules/profiles/application/constants/profile-messages.constants';
import { RegionRepository } from '@modules/profiles/domain/repositories/region.repository';
import { TownRepository } from '@modules/profiles/domain/repositories/town.repository';
import { ProfileUpdateInput } from '@modules/profiles/domain/repositories/profile.repository';
import { UpdateTagsCommand } from '@modules/profiles/application/commands/update-tags/update-tags.command';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @Inject(ProfileRepository)
    private readonly profileRepository: ProfileRepository,
    @Inject(RegionRepository)
    private readonly regionRepository: RegionRepository,
    @Inject(TownRepository)
    private readonly townRepository: TownRepository,
    private readonly commandBus: CommandBus,
  ) { }

  async execute(command: UpdateProfileCommand) {
    const profile = await this.profileRepository.findById(command.id);

    if (!profile) {
      throw new NotFoundException(PROFILE_MESSAGES.NOT_FOUND);
    }

    const { tags, regionName, townName, ...profileData } = command.data;

    const updateData: ProfileUpdateInput = {
      ...profileData,
      updatedBy: command.updatedBy,
    };

    if ('secondLastName' in command.data) {
      updateData.secondLastName = command.data.secondLastName?.trim() || null;
    }

    if (regionName) {
      const region = await this.regionRepository.findOrCreateByName(
        regionName.toUpperCase(),
      );
      updateData.regionId = region.id;
    }

    if (townName) {
      const town = await this.townRepository.findOrCreateByName(
        townName.toUpperCase(),
      );
      updateData.townId = town.id;
    }

    delete updateData.regionName;
    delete updateData.townName;

    const updatedProfile = await this.profileRepository.update(command.id, updateData);

    if (tags !== undefined) {
      await this.commandBus.execute(
        new UpdateTagsCommand(command.id, tags, command.updatedBy),
      );
    }

    const refreshedProfile = await this.profileRepository.findById(command.id);

    return {
      message: PROFILE_MESSAGES.UPDATED,
      data: ProfileResponseMapper.toProfileResponse(refreshedProfile ?? updatedProfile),
    };
  }
}
