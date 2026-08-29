import { RefreshTokenDto } from '@modules/auth/application/dto/requests/refresh-token.dto';

export class RefreshTokenCommand {
  constructor(public readonly dto: RefreshTokenDto) {}
}
