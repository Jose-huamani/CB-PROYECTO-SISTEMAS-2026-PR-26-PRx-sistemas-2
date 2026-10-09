import { UpdateBinnacleDto } from '@modules/binnacles/application/dto/request/update-binnacle.dto';

export class UpdateBinnacleCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateBinnacleDto,
    public readonly userId: number,
  ) {}
}
