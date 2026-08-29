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
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DeleteNotificationCommand } from '@modules/notifications/application/commands/delete-notification/delete-notification.command';
import { MarkNotificationsAsReadCommand } from '@modules/notifications/application/commands/mark-notifications-as-read/mark-notifications-as-read.command';
import { GetMeNotificationsDto } from '@modules/notifications/application/dto/requests/get-me-notifications.dto';
import { MarkNotificationsAsReadDto } from '@modules/notifications/application/dto/requests/mark-notifications-as-read.dto';
import { GetMeNotificationsQuery } from '@modules/notifications/application/queries/get-me-notifications/get-me-notifications.query';
import { GetMeUnreadNotificationsCountQuery } from '@modules/notifications/application/queries/get-me-unread-notifications-count/get-me-unread-notifications-count.query';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('me')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  getMeNotifications(
    @Query() dto: GetMeNotificationsDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.queryBus.execute(new GetMeNotificationsQuery(dto, userId));
  }

  @Get('me/unread-count')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  getUnreadNotificationsCount(@CurrentUser('sub') userId: number) {
    return this.queryBus.execute(
      new GetMeUnreadNotificationsCountQuery(userId),
    );
  }

  @Patch('read')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  markNotificationsAsRead(
    @Body() dto: MarkNotificationsAsReadDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(
      new MarkNotificationsAsReadCommand(dto, userId),
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  deleteNotification(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(new DeleteNotificationCommand(id, userId));
  }
}
