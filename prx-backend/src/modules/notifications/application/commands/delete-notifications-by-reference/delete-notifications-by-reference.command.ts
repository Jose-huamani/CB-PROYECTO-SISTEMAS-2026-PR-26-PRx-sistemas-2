import { NotificationType } from '@generated-prisma/enums';

export class DeleteNotificationsByReferenceCommand {
  constructor(
    public readonly type: NotificationType,
    public readonly referenceId: number,
    public readonly updatedBy: number,
  ) {}
}
