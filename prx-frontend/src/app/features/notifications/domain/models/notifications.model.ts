import { NotificationType } from '@shared/enums/notification-type.enum';
import { CurrentUserModel } from '@shared/models/current-user.model';

export interface NotificationModel {
  id: number;
  senderUserId: number;
  receiverUserId: number;
  title: string;
  type: NotificationType;
  referenceId: number;
  isRead: boolean;
  message: string | null;
  senderUser: CurrentUserModel;
  createdAt: string;
  updatedAt: string;
}
