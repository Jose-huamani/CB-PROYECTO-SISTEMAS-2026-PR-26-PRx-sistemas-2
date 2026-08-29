import { NotificationResponseDto } from '@modules/notifications/application/dto/responses/notification-response.dto';

import { NotificationEntity } from '@modules/notifications/domain/entities/notification.entity';

import { UserResponseMapper } from '@modules/users/application/mappers/user-response.mapper';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';

export class NotificationResponseMapper {
  static toNotificationResponse(
    entity: NotificationEntity,
  ): NotificationResponseDto {
    return {
      id: entity.id as number,
      senderUserId: entity.senderUserId,
      receiverUserId: entity.receiverUserId,
      title: entity.title,
      type: entity.type,
      referenceId: entity.referenceId,
      isRead: entity.isRead,
      message: entity.message,
      senderUser: UserResponseMapper.toUserResponse(entity.senderUser!),
      createdAt: entity.createdAt as Date,
      updatedAt: entity.updatedAt as Date,
    };
  }

  static toNotificationResponseList(
    entities: NotificationEntity[],
  ): NotificationResponseDto[] {
    return entities.map((entity) => this.toNotificationResponse(entity));
  }

  static toPaginatedResponse(
    pagination: PaginatedResponseDto<NotificationEntity>,
  ): PaginatedResponseDto<NotificationResponseDto> {
    return {
      items: NotificationResponseMapper.toNotificationResponseList(
        pagination.items,
      ),
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }
}
