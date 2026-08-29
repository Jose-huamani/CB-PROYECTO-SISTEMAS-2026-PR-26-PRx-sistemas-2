import { GetExplorerContentDto } from '@modules/files/application/dto/requests/get-explorer-content.dto';

export class GetExplorerContentQuery {
  constructor(
    public readonly repositoryId: number,
    public readonly dto: GetExplorerContentDto,
    public readonly userId: number,
  ) {}
}
