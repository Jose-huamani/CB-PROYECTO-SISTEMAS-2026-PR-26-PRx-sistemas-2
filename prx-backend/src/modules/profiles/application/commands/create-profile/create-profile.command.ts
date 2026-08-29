import { CreateProfileRequestDto } from '@modules/profiles/application/dto/requests/create-profile-request.dto';

export class CreateProfileCommand {
  constructor(
    public readonly data: CreateProfileRequestDto,
    public readonly createdBy: number,
    public readonly email: string,
  ) { }
}
