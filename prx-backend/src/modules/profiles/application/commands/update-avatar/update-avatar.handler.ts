import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PROFILE_MESSAGES } from '@modules/profiles/application/constants/profile-messages.constants';
import { ProfileResponseMapper } from '@modules/profiles/application/mappers/profile-response.mapper';
import { ProfileRepository } from '@modules/profiles/domain/repositories/profile.repository';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { AvatarService } from '@shared/infrastructure/avatar/avatar.service';
import { TigrisStorageService } from '@shared/infrastructure/storage/tigris-storage.service';

import { UpdateAvatarCommand } from '@modules/profiles/application/commands/update-avatar/update-avatar.command';

@CommandHandler(UpdateAvatarCommand)
export class UpdateAvatarHandler implements ICommandHandler<UpdateAvatarCommand> {
  constructor(
    @Inject(ProfileRepository)
    private readonly profileRepository: ProfileRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly avatarService: AvatarService,
    private readonly tigrisStorageService: TigrisStorageService,
  ) { }

  async execute(command: UpdateAvatarCommand) {
    if (!command.file) {
      throw new BadRequestException('El archivo del avatar es obligatorio');
    }

    if (command.file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('La imagen no puede superar 5MB');
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(command.file.mimetype)) {
      throw new BadRequestException('Solo se permiten imágenes JPG, PNG o WEBP');
    }

    const profile = await this.profileRepository.findById(command.userId);

    if (!profile) {
      throw new NotFoundException(PROFILE_MESSAGES.NOT_FOUND);
    }

    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new NotFoundException(PROFILE_MESSAGES.NOT_FOUND);
    }

    const currentAvatarUrl = user.avatarUrl ?? '';

    if (currentAvatarUrl && !this.avatarService.isDefaultAvatar(currentAvatarUrl)) {
      await this.tigrisStorageService.deleteObject(currentAvatarUrl, true);
    }

    const path = `avatar/user-${command.userId}-${Date.now()}.png`;

    await this.tigrisStorageService.uploadObject({
      path,
      body: command.file.buffer,
      isPublic: true,
      contentType: command.file.mimetype,
      multipart: true,
    });

    await this.userRepository.update(command.userId, {
      avatarUrl: path,
      updatedBy: command.userId,
    });

    const updatedProfile = await this.profileRepository.findById(command.userId);

    if (!updatedProfile) {
      throw new NotFoundException(PROFILE_MESSAGES.NOT_FOUND);
    }

    return {
      message: PROFILE_MESSAGES.AVATAR_UPDATED,
      data: ProfileResponseMapper.toProfileResponse(updatedProfile),
    };
  }
}
