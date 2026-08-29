import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { UsersController } from '@modules/users/presentation/controllers/users.controller';

import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { PrismaUserRepository } from '@modules/users/infrastructure/persistence/prisma-user.repository';

import { GetUserByIdHandler } from '@modules/users/application/queries/get-user-by-id/get-user-by-id.handler';
import { GetUsersHandler } from '@modules/users/application/queries/get-users/get-users.handler';

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    GetUserByIdHandler,
    GetUsersHandler,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class UsersModule {}
