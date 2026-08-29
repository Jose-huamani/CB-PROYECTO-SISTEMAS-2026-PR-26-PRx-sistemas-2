import { ResendCodeDto } from '@modules/auth/application/dto/requests/resend-code.dto';

export class ResendVerificationCodeCommand {
  constructor(public readonly dto: ResendCodeDto) {}
}
