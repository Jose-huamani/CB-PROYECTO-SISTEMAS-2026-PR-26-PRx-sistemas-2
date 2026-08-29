import { UnreadNotificationsCountResponseDto } from '@modules/notifications/application/dto/responses/unread-notifications-count-response.dto';

export class UnreadNotificationsCountResponseMapper {
  static toResponse(count: number): UnreadNotificationsCountResponseDto {
    return {
      count,
    };
  }
}
