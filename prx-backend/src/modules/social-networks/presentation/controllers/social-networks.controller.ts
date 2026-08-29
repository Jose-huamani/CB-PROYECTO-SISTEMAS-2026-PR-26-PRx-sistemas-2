import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@shared/presentation/decorators/public.decorator';
import { GetSocialNetworksQuery } from '@modules/social-networks/application/queries/get-social-networks/get-social-networks.query';

@ApiTags('Social Networks')
@Controller('social-networks')
export class SocialNetworksController {
    constructor(private readonly queryBus: QueryBus) { }

    @Public()
    @Get()
    @HttpCode(HttpStatus.OK)
    getSocialNetworks() {
        return this.queryBus.execute(new GetSocialNetworksQuery());
    }
}
