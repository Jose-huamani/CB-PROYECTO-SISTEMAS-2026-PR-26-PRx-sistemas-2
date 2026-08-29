import { NotificationType } from '@generated-prisma/enums';

import { UserResponseDto } from '@modules/users/application/dto/responses/user-response.dto';

export class NotificationResponseDto {
  id!: number;
  senderUserId!: number;
  receiverUserId!: number;
  title!: string;
  type!: NotificationType;
  referenceId!: number;
  isRead!: boolean;
  message?: string | null;
  senderUser!: UserResponseDto;
  createdAt!: Date;
  updatedAt!: Date;
}
