import { UserResponseDto } from '@modules/users/application/dto/responses/user-response.dto';
import { UserEntity } from '@modules/users/domain/entities/user.entity';

export class UserResponseMapper {
  static toUserResponse(user: UserEntity): UserResponseDto {
    return {
      id: user.id as number,
      username: user.username,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt as Date,
      updatedAt: user.updatedAt as Date,
    };
  }

  static toUserResponseList(users: UserEntity[]): UserResponseDto[] {
    return users.map((user) => this.toUserResponse(user));
  }
}
