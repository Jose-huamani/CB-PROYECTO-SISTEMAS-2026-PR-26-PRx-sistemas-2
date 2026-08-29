import { RegisterRequestDto } from '@modules/auth/application/dto/requests/register-request.dto';

export class RegisterRequestCommand {
  constructor(public readonly dto: RegisterRequestDto) {}
}
