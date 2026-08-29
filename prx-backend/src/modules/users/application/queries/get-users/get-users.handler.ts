import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { GetUsersQuery } from '@modules/users/application/queries/get-users/get-users.query';
import { UserResponseMapper } from '@modules/users/application/mappers/user-response.mapper';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute() {
    const users = await this.userRepository.findAll();

    return {
      data: UserResponseMapper.toUserResponseList(users),
    };
  }
}
