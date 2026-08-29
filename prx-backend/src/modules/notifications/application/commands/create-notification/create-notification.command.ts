import { NotificationType } from '@generated-prisma/enums';

export class CreateNotificationCommand {
  constructor(
    public readonly senderUserId: number,
    public readonly receiverUserId: number,
    public readonly title: string,
    public readonly type: NotificationType,
    public readonly referenceId: number,
    public readonly createdBy: number,
    public readonly message?: string | null,
  ) {}
}
