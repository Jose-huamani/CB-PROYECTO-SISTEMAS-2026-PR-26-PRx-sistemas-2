import { Role } from '@generated-prisma/enums';
import { UserEntity } from '@modules/users/domain/entities/user.entity';

type UserPrismaModel = {
  id: number;
  username: string;
  email: string;
  password: string;
  role: Role;
  avatarUrl: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy?: number | null;
};

export class UserPrismaMapper {
  static toDomain(user: UserPrismaModel): UserEntity {
    return new UserEntity(
      user.id,
      user.username,
      user.email,
      user.password,
      user.role,
      user.avatarUrl,
      user.createdBy,
      user.status,
      user.createdAt,
      user.updatedAt,
      user.updatedBy ?? undefined,
    );
  }

  static toDomainList(users: UserPrismaModel[]): UserEntity[] {
    return users.map((user) => this.toDomain(user));
  }
}
