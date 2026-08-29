import { Injectable } from '@nestjs/common';

import { NotificationEntity } from '@modules/notifications/domain/entities/notification.entity';
import { PrismaNotificationMapper } from '@modules/notifications/infrastructure/mappers/prisma-notification.mapper';

import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';

import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { NotificationType } from '@generated-prisma/enums';
import { NotificationRepository } from '@modules/notifications/domain/repositories/notification.repository';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: NotificationEntity): Promise<NotificationEntity> {
    const notification = await this.prisma.notification.create({
      data: {
        senderUserId: entity.senderUserId,
        receiverUserId: entity.receiverUserId,
        title: entity.title,
        type: entity.type,
        referenceId: entity.referenceId,
        isRead: entity.isRead ?? false,
        message: entity.message,
        createdBy: entity.createdBy,
      },
      include: {
        senderUser: true,
      },
    });

    return PrismaNotificationMapper.toDomain(notification);
  }

  async findById(id: number): Promise<NotificationEntity | null> {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id,
        status: 1,
      },

      include: {
        senderUser: true,
      },
    });

    if (!notification) {
      return null;
    }

    return PrismaNotificationMapper.toDomain(notification);
  }

  async findMe(
    receiverUserId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedResponseDto<NotificationEntity>> {
    const skip = (page - 1) * limit;
    const where = {
      receiverUserId,
      status: 1,
    };

    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
        include: {
          senderUser: true,
        },
      }),

      this.prisma.notification.count({
        where,
      }),
    ]);

    return {
      items: PrismaNotificationMapper.toDomainList(items),
      total,
      page,
      limit,
    };
  }

  async countUnread(receiverUserId: number): Promise<number> {
    return await this.prisma.notification.count({
      where: {
        receiverUserId,
        isRead: false,
        status: 1,
      },
    });
  }

  async markManyAsRead(
    ids: number[],
    receiverUserId: number,
    updatedBy: number,
  ): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        id: {
          in: ids,
        },
        receiverUserId,
        status: 1,
      },
      data: {
        isRead: true,
        updatedBy,
      },
    });
  }

  async softDelete(
    id: number,
    receiverUserId: number,
    deletedBy: number,
  ): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        id,
        receiverUserId,
        status: 1,
      },

      data: {
        status: 0,
        updatedBy: deletedBy,
      },
    });
  }

  async softDeleteByReference(
    type: NotificationType,
    referenceId: number,
    updatedBy: number,
  ): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        type,
        referenceId,
        status: 1,
      },
      data: {
        status: 0,
        updatedBy,
      },
    });
  }
}
