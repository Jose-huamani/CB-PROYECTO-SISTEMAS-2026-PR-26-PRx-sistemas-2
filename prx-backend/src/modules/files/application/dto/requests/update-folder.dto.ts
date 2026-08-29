import { PartialType, PickType } from '@nestjs/swagger';

import { CreateFolderDto } from '@modules/files/application/dto/requests/create-folder.dto';

export class UpdateFolderDto extends PartialType(
  PickType(CreateFolderDto, ['name', 'color'] as const),
) {}
