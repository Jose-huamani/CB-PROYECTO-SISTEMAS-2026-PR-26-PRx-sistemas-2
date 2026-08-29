import { NotificationType, Role } from '@generated-prisma/enums';
import { NotificationEntity } from '@modules/notifications/domain/entities/notification.entity';
import { UserPrismaMapper } from '@modules/users/infrastructure/mappers/user-prisma.mapper';

type NotificationPrismaModel = {
  id: number;
  senderUserId: number;
  receiverUserId: number;
  title: string;
  type: NotificationType;
  referenceId: number;
  isRead: boolean;
  message?: string | null;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy?: number | null;
  senderUser: {
    id: number;
    username: string;
    email: string;
    password: string;
    role: Role;
    avatarUrl: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy?: number | null;
  };
};

export class PrismaNotificationMapper {
  static toDomain(notification: NotificationPrismaModel): NotificationEntity {
    return new NotificationEntity(
      notification.id,
      notification.senderUserId,
      notification.receiverUserId,
      notification.title,
      notification.type,
      notification.referenceId,
      notification.isRead,
      notification.createdBy,
      notification.message,
      UserPrismaMapper.toDomain(notification.senderUser),
      notification.status,
      notification.createdAt,
      notification.updatedAt,
      notification.updatedBy ?? undefined,
    );
  }

  static toDomainList(
    notifications: NotificationPrismaModel[],
  ): NotificationEntity[] {
    return notifications.map((notification) => this.toDomain(notification));
  }
}
