import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { TagsModule } from '@modules/tags/tags.module';
import { UsersModule } from '@modules/users/users.module';

import { RepositoryAccessService } from '@modules/repositories/application/access/repository-access.service';

import { CreateRepositoryHandler } from '@modules/repositories/application/commands/create-repository/create-repository.handler';
import { DeleteRepositoryHandler } from '@modules/repositories/application/commands/delete-repository/delete-repository.handler';
import { DeleteRepositoryUserHandler } from '@modules/repositories/application/commands/delete-repository-user/delete-repository-user.handler';
import { UpdateRepositoryHandler } from '@modules/repositories/application/commands/update-repository/update-repository.handler';
import { UpdateRepositoryUserHandler } from '@modules/repositories/application/commands/update-repository-user/update-repository-user.handler';

import { GetExploreRepositoriesHandler } from '@modules/repositories/application/queries/get-explore-repositories/get-explore-repositories.handler';
import { GetMeIntimateRepositoryHandler } from '@modules/repositories/application/queries/get-me-intimate-repository/get-me-intimate-repository.handler';
import { GetMeRepositoriesHandler } from '@modules/repositories/application/queries/get-me-repositories/get-me-repositories.handler';
import { GetPublicRepositoriesByUserHandler } from '@modules/repositories/application/queries/get-public-repositories-by-user/get-public-repositories-by-user.handler';
import { GetRepositoryByIdHandler } from '@modules/repositories/application/queries/get-repository-by-id/get-repository-by-id.handler';
import { GetRepositoryCategoriesHandler } from '@modules/repositories/application/queries/get-repository-categories/get-repository-categories.handler';
import { GetRepositoryFunctionsHandler } from '@modules/repositories/application/queries/get-repository-functions/get-repository-functions.handler';
import { GetRepositoryRolesHandler } from '@modules/repositories/application/queries/get-repository-roles/get-repository-roles.handler';
import { GetRepositoryUsersHandler } from '@modules/repositories/application/queries/get-repository-users/get-repository-users.handler';

import { RepositoryAccessRepository } from '@modules/repositories/domain/repositories/repository-access.repository';
import { RepositoryCategoryRepository } from '@modules/repositories/domain/repositories/repository-category.repository';
import { RepositoryFunctionRepository } from '@modules/repositories/domain/repositories/repository-function.repository';
import { RepositoryRoleRepository } from '@modules/repositories/domain/repositories/repository-role.repository';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';

import { PrismaRepositoryAccessRepository } from '@modules/repositories/infrastructure/persistence/prisma-repository-access.repository';
import { PrismaRepositoryCategoryRepository } from '@modules/repositories/infrastructure/persistence/prisma-repository-category.repository';
import { PrismaRepositoryFunctionRepository } from '@modules/repositories/infrastructure/persistence/prisma-repository-function.repository';
import { PrismaRepositoryRoleRepository } from '@modules/repositories/infrastructure/persistence/prisma-repository-role.repository';
import { PrismaRepositoryUserRepository } from '@modules/repositories/infrastructure/persistence/prisma-repository-user.repository';
import { PrismaRepositoryRepository } from '@modules/repositories/infrastructure/persistence/prisma-repository.repository';

import { RepositoriesController } from '@modules/repositories/presentation/controllers/repositories.controller';
import { RepositoryAccessGuard } from '@modules/repositories/presentation/guards/repository-access.guard';

import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [CqrsModule, PrismaModule, TagsModule, UsersModule],
  controllers: [RepositoriesController],
  providers: [
    CreateRepositoryHandler,
    UpdateRepositoryHandler,
    DeleteRepositoryHandler,
    UpdateRepositoryUserHandler,
    DeleteRepositoryUserHandler,

    GetRepositoryByIdHandler,
    GetMeIntimateRepositoryHandler,
    GetMeRepositoriesHandler,
    GetExploreRepositoriesHandler,
    GetPublicRepositoriesByUserHandler,
    GetRepositoryCategoriesHandler,
    GetRepositoryRolesHandler,
    GetRepositoryFunctionsHandler,
    GetRepositoryUsersHandler,

    RepositoryAccessGuard,
    RepositoryAccessService,

    {
      provide: RepositoryRepository,
      useClass: PrismaRepositoryRepository,
    },
    {
      provide: RepositoryAccessRepository,
      useClass: PrismaRepositoryAccessRepository,
    },
    {
      provide: RepositoryCategoryRepository,
      useClass: PrismaRepositoryCategoryRepository,
    },
    {
      provide: RepositoryRoleRepository,
      useClass: PrismaRepositoryRoleRepository,
    },
    {
      provide: RepositoryFunctionRepository,
      useClass: PrismaRepositoryFunctionRepository,
    },
    {
      provide: RepositoryUserRepository,
      useClass: PrismaRepositoryUserRepository,
    },
  ],
  exports: [
    RepositoryAccessService,
    RepositoryRepository,
    RepositoryUserRepository,
    RepositoryRoleRepository,
  ],
})
export class RepositoriesModule {}
