import { MarkNotificationsAsReadDto } from '@modules/notifications/application/dto/requests/mark-notifications-as-read.dto';

export class MarkNotificationsAsReadCommand {
  constructor(
    public readonly dto: MarkNotificationsAsReadDto,
    public readonly userId: number,
  ) {}
}
