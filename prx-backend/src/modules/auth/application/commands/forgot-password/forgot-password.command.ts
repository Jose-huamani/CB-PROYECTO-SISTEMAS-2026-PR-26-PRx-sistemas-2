import { ForgotPasswordDto } from '@modules/auth/application/dto/requests/forgot-password.dto';

export class ForgotPasswordCommand {
  constructor(public readonly dto: ForgotPasswordDto) {}
}
