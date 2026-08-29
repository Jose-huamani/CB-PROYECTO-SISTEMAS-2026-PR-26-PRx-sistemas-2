import { ResetPasswordDto } from '@modules/auth/application/dto/requests/reset-password.dto';

export class ResetPasswordCommand {
  constructor(public readonly dto: ResetPasswordDto) {}
}
