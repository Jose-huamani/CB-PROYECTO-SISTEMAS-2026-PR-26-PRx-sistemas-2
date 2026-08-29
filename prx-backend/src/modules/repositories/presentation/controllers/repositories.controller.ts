import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateRepositoryCommand } from '@modules/repositories/application/commands/create-repository/create-repository.command';
import { DeleteRepositoryCommand } from '@modules/repositories/application/commands/delete-repository/delete-repository.command';
import { DeleteRepositoryUserCommand } from '@modules/repositories/application/commands/delete-repository-user/delete-repository-user.command';
import { UpdateRepositoryCommand } from '@modules/repositories/application/commands/update-repository/update-repository.command';
import { UpdateRepositoryUserCommand } from '@modules/repositories/application/commands/update-repository-user/update-repository-user.command';
import { CreateRepositoryDto } from '@modules/repositories/application/dto/requests/create-repository.dto';
import { GetExploreRepositoriesDto } from '@modules/repositories/application/dto/requests/get-explore-repositories.dto';
import { GetMeRepositoriesDto } from '@modules/repositories/application/dto/requests/get-me-repositories.dto';
import { GetPublicRepositoriesByUserDto } from '@modules/repositories/application/dto/requests/get-public-repositories-by-user.dto';
import { GetRepositoryCategoriesDto } from '@modules/repositories/application/dto/requests/get-repository-categories.dto';
import { GetRepositoryUsersDto } from '@modules/repositories/application/dto/requests/get-repository-users.dto';
import { UpdateRepositoryDto } from '@modules/repositories/application/dto/requests/update-repository.dto';
import { UpdateRepositoryUserDto } from '@modules/repositories/application/dto/requests/update-repository-user.dto';
import { RepositoryAccessAction } from '@modules/repositories/application/enums/repository-access-action.enum';
import { GetExploreRepositoriesQuery } from '@modules/repositories/application/queries/get-explore-repositories/get-explore-repositories.query';
import { GetMeIntimateRepositoryQuery } from '@modules/repositories/application/queries/get-me-intimate-repository/get-me-intimate-repository.query';
import { GetMeRepositoriesQuery } from '@modules/repositories/application/queries/get-me-repositories/get-me-repositories.query';
import { GetPublicRepositoriesByUserQuery } from '@modules/repositories/application/queries/get-public-repositories-by-user/get-public-repositories-by-user.query';
import { GetRepositoryByIdQuery } from '@modules/repositories/application/queries/get-repository-by-id/get-repository-by-id.query';
import { GetRepositoryCategoriesQuery } from '@modules/repositories/application/queries/get-repository-categories/get-repository-categories.query';
import { GetRepositoryFunctionsQuery } from '@modules/repositories/application/queries/get-repository-functions/get-repository-functions.query';
import { GetRepositoryRolesQuery } from '@modules/repositories/application/queries/get-repository-roles/get-repository-roles.query';
import { GetRepositoryUsersQuery } from '@modules/repositories/application/queries/get-repository-users/get-repository-users.query';
import { CreateRepositoryInvitationCommand } from '@modules/repository-invitations/application/commands/create-repository-invitation/create-repository-invitation.command';
import { CreateRepositoryInvitationDto } from '@modules/repository-invitations/application/dto/requests/create-repository-invitation.dto';

import { RepositoryAccess } from '@modules/repositories/presentation/decorators/repository-access.decorator';

import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { Public } from '@shared/presentation/decorators/public.decorator';

@ApiTags('Repositories')
@Controller('repositories')
export class RepositoriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateRepositoryDto, @CurrentUser('sub') userId: number) {
    return this.commandBus.execute(new CreateRepositoryCommand(dto, userId));
  }

  @Public()
  @Get('categories')
  @HttpCode(HttpStatus.OK)
  findCategories(@Query() query: GetRepositoryCategoriesDto) {
    return this.queryBus.execute(new GetRepositoryCategoriesQuery(query));
  }

  @Get('roles')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  findRoles() {
    return this.queryBus.execute(new GetRepositoryRolesQuery());
  }

  @Get('functions')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  findFunctions() {
    return this.queryBus.execute(new GetRepositoryFunctionsQuery());
  }

  @Get('me')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  findMeRepositories(
    @Query() query: GetMeRepositoriesDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.queryBus.execute(new GetMeRepositoriesQuery(query, userId));
  }

  @Get('me/intimate')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  findMeIntimateRepository(@CurrentUser('sub') userId: number) {
    return this.queryBus.execute(new GetMeIntimateRepositoryQuery(userId));
  }

  @Public()
  @Get('explore')
  @HttpCode(HttpStatus.OK)
  findExploreRepositories(@Query() query: GetExploreRepositoriesDto) {
    return this.queryBus.execute(new GetExploreRepositoriesQuery(query));
  }

  @Public()
  @Get('users/:userId/public')
  @HttpCode(HttpStatus.OK)
  findPublicByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: GetPublicRepositoriesByUserDto,
  ) {
    return this.queryBus.execute(
      new GetPublicRepositoriesByUserQuery(userId, query),
    );
  }

  @Get(':id/users')
  @ApiBearerAuth()
  @RepositoryAccess(RepositoryAccessAction.READ)
  @HttpCode(HttpStatus.OK)
  findRepositoryUsers(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetRepositoryUsersDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.queryBus.execute(
      new GetRepositoryUsersQuery(id, query, userId),
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @RepositoryAccess(RepositoryAccessAction.READ)
  @HttpCode(HttpStatus.OK)
  findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ) {
    return this.queryBus.execute(new GetRepositoryByIdQuery(id, userId));
  }

  @Patch(':id')
  @ApiBearerAuth()
  @RepositoryAccess(RepositoryAccessAction.UPDATE)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRepositoryDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(
      new UpdateRepositoryCommand(id, dto, userId),
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @RepositoryAccess(RepositoryAccessAction.DELETE)
  @HttpCode(HttpStatus.OK)
  delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(new DeleteRepositoryCommand(id, userId));
  }

  @Post(':id/invitations')
  @ApiBearerAuth()
  @RepositoryAccess(RepositoryAccessAction.UPDATE)
  @HttpCode(HttpStatus.CREATED)
  createInvitation(
    @Param('id', ParseIntPipe) repositoryId: number,
    @Body() dto: CreateRepositoryInvitationDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(
      new CreateRepositoryInvitationCommand(repositoryId, dto, userId),
    );
  }

  @Patch(':id/users/:userId')
  @ApiBearerAuth()
  @RepositoryAccess(RepositoryAccessAction.UPDATE)
  @HttpCode(HttpStatus.OK)
  updateRepositoryUser(
    @Param('id', ParseIntPipe) repositoryId: number,
    @Param('userId', ParseIntPipe) targetUserId: number,
    @Body() dto: UpdateRepositoryUserDto,
    @CurrentUser('sub') requestUserId: number,
  ) {
    return this.commandBus.execute(
      new UpdateRepositoryUserCommand(
        repositoryId,
        targetUserId,
        dto,
        requestUserId,
      ),
    );
  }

  @Delete(':id/users/:userId')
  @ApiBearerAuth()
  @RepositoryAccess(RepositoryAccessAction.DELETE)
  @HttpCode(HttpStatus.OK)
  removeRepositoryUser(
    @Param('id', ParseIntPipe) repositoryId: number,
    @Param('userId', ParseIntPipe) targetUserId: number,
    @CurrentUser('sub') requestUserId: number,
  ) {
    return this.commandBus.execute(
      new DeleteRepositoryUserCommand(
        repositoryId,
        targetUserId,
        requestUserId,
      ),
    );
  }
}
