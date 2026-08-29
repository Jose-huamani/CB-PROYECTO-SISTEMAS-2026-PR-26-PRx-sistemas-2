import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GetUserByIdQuery } from '@modules/users/application/queries/get-user-by-id/get-user-by-id.query';
import { GetUsersQuery } from '@modules/users/application/queries/get-users/get-users.query';
import { Role } from '@generated-prisma/enums';
import { Roles } from '@shared/presentation/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Roles(Role.metaadministrador)
@Controller('users')
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.queryBus.execute(new GetUsersQuery());
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetUserByIdQuery(id));
  }
}
