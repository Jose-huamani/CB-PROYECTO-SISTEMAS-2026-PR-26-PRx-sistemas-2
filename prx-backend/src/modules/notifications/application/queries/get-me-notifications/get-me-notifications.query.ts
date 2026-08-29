import { GetMeNotificationsDto } from '@modules/notifications/application/dto/requests/get-me-notifications.dto';

export class GetMeNotificationsQuery {
  constructor(
    public readonly dto: GetMeNotificationsDto,
    public readonly userId: number,
  ) {}
}
