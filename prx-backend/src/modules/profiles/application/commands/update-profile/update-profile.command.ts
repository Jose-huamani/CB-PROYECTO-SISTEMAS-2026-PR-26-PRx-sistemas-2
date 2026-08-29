import { UpdateProfileRequestDto } from '@modules/profiles/application/dto/requests/update-profile-request.dto';

export class UpdateProfileCommand {
  constructor(
    public readonly id: number,
    public readonly data: UpdateProfileRequestDto,
    public readonly updatedBy: number,
  ) { }
}
