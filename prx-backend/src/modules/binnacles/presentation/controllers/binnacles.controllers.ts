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
  Put,
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
import { Role } from '@generated-prisma/enums';
import { Roles } from '@shared/presentation/decorators/roles.decorator';
import { GetBinnacleByIdQuery } from '@modules/binnacles/application/queries/get-binnacle-by-id/get-binnacle-by-id.query';
import { UpdateBinnacleDto } from '@modules/binnacles/application/dto/request/update-binnacle.dto';
import { UpdateBinnacleCommand } from '@modules/binnacles/application/commands/update-binnacle/update-binnacle.command';

@ApiTags('Binnacles')
@ApiBearerAuth()
@Controller('binnacles')
@Roles(Role.estandar)
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

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ) {
    return this.queryBus.execute(new GetBinnacleByIdQuery(id, userId));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBinnacleDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(new UpdateBinnacleCommand(id, dto, userId));
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
