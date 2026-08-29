import { GetMeBinnaclesDto } from '@modules/binnacles/application/dto/request/get-me-binnacles.dto';

export class GetMeBinnaclesQuery {
  constructor(
    public readonly dto: GetMeBinnaclesDto,
    public readonly userId: number,
  ) {}
}
