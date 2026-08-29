import { AuthResponseDto } from '@modules/auth/application/dto/responses/auth-response.dto';
import { UserEntity } from '@modules/users/domain/entities/user.entity';
import { UserResponseMapper } from '@modules/users/application/mappers/user-response.mapper';

export class AuthResponseMapper {
  static toAuthResponse(
    user: UserEntity,
    accessToken: string,
    refreshToken: string,
  ): AuthResponseDto {
    return {
      accessToken,
      refreshToken,
      user: UserResponseMapper.toUserResponse(user),
    };
  }
}
