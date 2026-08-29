import { CreateBinnacleDto } from '@modules/binnacles/application/dto/request/create-binnacle.dto';

export class CreateBinnacleCommand {
  constructor(
    public readonly dto: CreateBinnacleDto,
    public readonly userId: number,
  ) {}
}
