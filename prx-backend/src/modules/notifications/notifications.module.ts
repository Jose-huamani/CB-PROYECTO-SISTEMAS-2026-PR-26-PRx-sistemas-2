import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { NotificationsController } from '@modules/notifications/presentation/controllers/notifications.controller';

import { CreateNotificationHandler } from '@modules/notifications/application/commands/create-notification/create-notification.handler';
import { DeleteNotificationHandler } from '@modules/notifications/application/commands/delete-notification/delete-notification.handler';
import { MarkNotificationsAsReadHandler } from '@modules/notifications/application/commands/mark-notifications-as-read/mark-notifications-as-read.handler';

import { GetMeNotificationsHandler } from '@modules/notifications/application/queries/get-me-notifications/get-me-notifications.handler';
import { GetMeUnreadNotificationsCountHandler } from '@modules/notifications/application/queries/get-me-unread-notifications-count/get-me-unread-notifications-count.handler';

import { NotificationRepository } from '@modules/notifications/domain/repositories/notification.repository';

import { PrismaNotificationRepository } from '@modules/notifications/infrastructure/persistence/prisma-notification.repository';

import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { DeleteNotificationsByReferenceHandler } from '@modules/notifications/application/commands/delete-notifications-by-reference/delete-notifications-by-reference.handler';

@Module({
  imports: [CqrsModule, PrismaModule],

  controllers: [NotificationsController],

  providers: [
    CreateNotificationHandler,
    DeleteNotificationHandler,
    MarkNotificationsAsReadHandler,
    DeleteNotificationsByReferenceHandler,

    GetMeNotificationsHandler,
    GetMeUnreadNotificationsCountHandler,
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
  ],

  exports: [NotificationRepository],
})
export class NotificationsModule {}
