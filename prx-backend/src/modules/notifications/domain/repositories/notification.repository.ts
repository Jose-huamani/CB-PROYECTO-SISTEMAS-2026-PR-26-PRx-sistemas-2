import { NotificationType } from '@generated-prisma/enums';
import { NotificationEntity } from '@modules/notifications/domain/entities/notification.entity';

import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';

export abstract class NotificationRepository {
  abstract create(
    notification: NotificationEntity,
  ): Promise<NotificationEntity>;

  abstract findById(id: number): Promise<NotificationEntity | null>;

  abstract findMe(
    receiverUserId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedResponseDto<NotificationEntity>>;

  abstract countUnread(receiverUserId: number): Promise<number>;

  abstract markManyAsRead(
    ids: number[],
    receiverUserId: number,
    updatedBy: number,
  ): Promise<void>;

  abstract softDelete(
    id: number,
    receiverUserId: number,
    deletedBy: number,
  ): Promise<void>;

  abstract softDeleteByReference(
    type: NotificationType,
    referenceId: number,
    updatedBy: number,
  ): Promise<void>;
}
