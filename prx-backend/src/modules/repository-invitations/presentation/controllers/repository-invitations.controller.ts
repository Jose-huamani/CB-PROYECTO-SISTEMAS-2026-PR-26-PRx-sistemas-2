import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AcceptRepositoryInvitationCommand } from '@modules/repository-invitations/application/commands/accept-repository-invitation/accept-repository-invitation.command';
import { RejectRepositoryInvitationCommand } from '@modules/repository-invitations/application/commands/reject-repository-invitation/reject-repository-invitation.command';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { CreateRepositoryInvitationDto } from '@modules/repository-invitations/application/dto/requests/create-repository-invitation.dto';
import { CreateRepositoryInvitationCommand } from '@modules/repository-invitations/application/commands/create-repository-invitation/create-repository-invitation.command';
import { GetRepositoryInvitationByIdQuery } from '@modules/repository-invitations/application/queries/get-repository-invitation-by-id/get-repository-invitation-by-id.query';

@ApiTags('Repository Invitations')
@Controller('repository-invitations')
export class RepositoryInvitationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(':repositoryId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('repositoryId', ParseIntPipe) repositoryId: number,
    @Body() dto: CreateRepositoryInvitationDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(
      new CreateRepositoryInvitationCommand(repositoryId, dto, userId),
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ) {
    return this.queryBus.execute(
      new GetRepositoryInvitationByIdQuery(id, userId),
    );
  }

  @Patch(':id/accept')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  accept(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(
      new AcceptRepositoryInvitationCommand(id, userId),
    );
  }

  @Patch(':id/reject')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  reject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(
      new RejectRepositoryInvitationCommand(id, userId),
    );
  }
}
