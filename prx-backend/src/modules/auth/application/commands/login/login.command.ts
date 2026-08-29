import { LoginDto } from '@modules/auth/application/dto/requests/login.dto';

export class LoginCommand {
  constructor(
    public readonly dto: LoginDto,
    public readonly userAgent?: string,
    public readonly ipAddress?: string,
  ) {}
}
