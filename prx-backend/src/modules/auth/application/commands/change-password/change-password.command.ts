import { ChangePasswordDto } from '@modules/auth/application/dto/requests/change-password.dto';

export class ChangePasswordCommand {
  constructor(
    public readonly dto: ChangePasswordDto,
    public readonly userId: number,
  ) {}
}
