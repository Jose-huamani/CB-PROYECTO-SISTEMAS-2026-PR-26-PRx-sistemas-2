import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { NotificationsModule } from '@modules/notifications/notifications.module';
import { RepositoriesModule } from '@modules/repositories/repositories.module';
import { UsersModule } from '@modules/users/users.module';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';

import { RepositoryInvitationsController } from '@modules/repository-invitations/presentation/controllers/repository-invitations.controller';

import { CreateRepositoryInvitationHandler } from '@modules/repository-invitations/application/commands/create-repository-invitation/create-repository-invitation.handler';
import { AcceptRepositoryInvitationHandler } from '@modules/repository-invitations/application/commands/accept-repository-invitation/accept-repository-invitation.handler';
import { RejectRepositoryInvitationHandler } from '@modules/repository-invitations/application/commands/reject-repository-invitation/reject-repository-invitation.handler';

import { RepositoryInvitationRepository } from '@modules/repository-invitations/domain/repositories/repository-invitation.repository';
import { PrismaRepositoryInvitationRepository } from '@modules/repository-invitations/infrastructure/persistence/prisma-repository-invitation.repository';
import { GetRepositoryInvitationByIdHandler } from '@modules/repository-invitations/application/queries/get-repository-invitation-by-id/get-repository-invitation-by-id.handler';

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    NotificationsModule,
    RepositoriesModule,
    UsersModule,
  ],
  controllers: [RepositoryInvitationsController],
  providers: [
    CreateRepositoryInvitationHandler,
    AcceptRepositoryInvitationHandler,
    RejectRepositoryInvitationHandler,
    GetRepositoryInvitationByIdHandler,
    {
      provide: RepositoryInvitationRepository,
      useClass: PrismaRepositoryInvitationRepository,
    },
  ],
  exports: [RepositoryInvitationRepository],
})
export class RepositoryInvitationsModule {}
