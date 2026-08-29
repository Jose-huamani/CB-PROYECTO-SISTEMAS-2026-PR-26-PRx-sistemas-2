import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ProfilesController } from '@modules/profiles/presentation/controllers/profiles.controller';
import { UsersModule } from '@modules/users/users.module';
import { TagsModule } from '@modules/tags/tags.module';

import { ProfileRepository } from '@modules/profiles/domain/repositories/profile.repository';
import { PrismaProfileRepository } from '@modules/profiles/infrastructure/persistence/prisma-profile.repository';

import { CountryRepository } from '@modules/profiles/domain/repositories/country.repository';
import { PrismaCountryRepository } from '@modules/profiles/infrastructure/persistence/prisma-country.repository';
import { RegionRepository } from '@modules/profiles/domain/repositories/region.repository';
import { PrismaRegionRepository } from '@modules/profiles/infrastructure/persistence/prisma-region.repository';
import { TownRepository } from '@modules/profiles/domain/repositories/town.repository';
import { PrismaTownRepository } from '@modules/profiles/infrastructure/persistence/prisma-town.repository';

import { GetProfileByIdHandler } from '@modules/profiles/application/queries/get-profile-by-id/get-profile-by-id.handler';
import { CreateProfileHandler } from '@modules/profiles/application/commands/create-profile/create-profile.handler';
import { UpdateProfileHandler } from '@modules/profiles/application/commands/update-profile/update-profile.handler';
import { GetCountriesHandler } from '@modules/profiles/application/queries/get-countries/get-countries.handler';
import { UpdateAvatarHandler } from '@modules/profiles/application/commands/update-avatar/update-avatar.handler';
import { UpdateTagsHandler } from '@modules/profiles/application/commands/update-tags/update-tags.handler';
import { GetTagsHandler } from '@modules/profiles/application/queries/get-tags/get-tags.handler';
import { AvatarService } from '@shared/infrastructure/avatar/avatar.service';
import { StorageModule } from '@shared/infrastructure/storage/storage.module';
import { TagProfileRepository } from '@modules/profiles/domain/repositories/tag-profile.repository';
import { PrismaTagProfileRepository } from '@modules/profiles/infrastructure/persistence/prisma-tag-profile.repository';

@Module({
  imports: [CqrsModule, UsersModule, StorageModule, TagsModule],
  controllers: [ProfilesController],
  providers: [
    GetProfileByIdHandler,
    CreateProfileHandler,
    UpdateProfileHandler,
    GetCountriesHandler,
    UpdateAvatarHandler,
    UpdateTagsHandler,
    GetTagsHandler,
    AvatarService,
    {
      provide: ProfileRepository,
      useClass: PrismaProfileRepository,
    },
    {
      provide: CountryRepository,
      useClass: PrismaCountryRepository,
    },
    {
      provide: RegionRepository,
      useClass: PrismaRegionRepository,
    },
    {
      provide: TownRepository,
      useClass: PrismaTownRepository,
    },
    {
      provide: TagProfileRepository,
      useClass: PrismaTagProfileRepository,
    },
  ],
  exports: [ProfileRepository],
})
export class ProfilesModule { }
