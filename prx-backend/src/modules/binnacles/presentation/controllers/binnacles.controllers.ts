import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateBinnacleCommand } from '@modules/binnacles/application/commands/create-binnacle/create-binnacle.command';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { CreateBinnacleDto } from '@modules/binnacles/application/dto/request/create-binnacle.dto';
import { DeleteBinnacleCommand } from '@modules/binnacles/application/commands/delete-binacle/delete-binnacle.command';
import { GetMeBinnaclesQuery } from '@modules/binnacles/application/queries/get-me-binnacles/get-me-binnacles.query';
import { GetMeBinnaclesDto } from '@modules/binnacles/application/dto/request/get-me-binnacles.dto';

@ApiTags('Binnacles')
@ApiBearerAuth()
@Controller('binnacles')
export class BinnaclesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateBinnacleDto, @CurrentUser('sub') userId: number) {
    return this.commandBus.execute(new CreateBinnacleCommand(dto, userId));
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  findPaginatedMe(
    @Query() query: GetMeBinnaclesDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.queryBus.execute(new GetMeBinnaclesQuery(query, userId));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(new DeleteBinnacleCommand(id, userId));
  }
}
