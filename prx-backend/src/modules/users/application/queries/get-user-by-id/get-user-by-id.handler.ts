import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserResponseMapper } from '@modules/users/application/mappers/user-response.mapper';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';
import { GetUserByIdQuery } from '@modules/users/application/queries/get-user-by-id/get-user-by-id.query';
import { USER_MESSAGES } from '@modules/users/application/constants/user-messages.constants';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetUserByIdQuery) {
    const user = await this.userRepository.findById(query.id);

    if (!user) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }

    return {
      data: UserResponseMapper.toUserResponse(user),
    };
  }
}
