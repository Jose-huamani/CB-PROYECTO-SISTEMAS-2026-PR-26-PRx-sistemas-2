import { LogoutDto } from '@modules/auth/application/dto/requests/logout.dto';

export class LogoutCommand {
  constructor(public readonly dto: LogoutDto) {}
}
