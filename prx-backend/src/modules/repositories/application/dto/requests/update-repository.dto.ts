import { PartialType } from '@nestjs/swagger';

import { CreateRepositoryDto } from '@modules/repositories/application/dto/requests/create-repository.dto';

export class UpdateRepositoryDto extends PartialType(CreateRepositoryDto) {}
