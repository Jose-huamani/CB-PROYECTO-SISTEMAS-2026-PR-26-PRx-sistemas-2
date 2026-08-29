import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { MeQuery } from '@modules/auth/application/queries/me/me.query';
import { UserResponseMapper } from '@modules/users/application/mappers/user-response.mapper';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';

import { USER_MESSAGES } from '@modules/users/application/constants/user-messages.constants';

@QueryHandler(MeQuery)
export class MeHandler implements IQueryHandler<MeQuery> {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: MeQuery) {
    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND);
    }

    return UserResponseMapper.toUserResponse(user);
  }
}
