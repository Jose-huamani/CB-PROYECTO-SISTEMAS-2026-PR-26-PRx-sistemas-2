import { NotificationType } from '@generated-prisma/enums';

import { UserEntity } from '@modules/users/domain/entities/user.entity';

import { AuditableEntity } from '@shared/domain/auditable.entity';

export class NotificationEntity extends AuditableEntity {
  constructor(
    id: number | null,
    public senderUserId: number,
    public receiverUserId: number,
    public title: string,
    public type: NotificationType,
    public referenceId: number,
    public isRead: boolean,
    createdBy: number,
    public message?: string | null,
    public senderUser?: UserEntity,
    status?: number,
    createdAt?: Date,
    updatedAt?: Date,
    updatedBy?: number,
  ) {
    super(id, createdBy, status, createdAt, updatedAt, updatedBy);
  }
}
