import { GetTagsDto } from '@modules/profiles/application/dto/requests/get-tags.dto';

export class GetTagsQuery {
    constructor(public readonly dto: GetTagsDto) { }
}
