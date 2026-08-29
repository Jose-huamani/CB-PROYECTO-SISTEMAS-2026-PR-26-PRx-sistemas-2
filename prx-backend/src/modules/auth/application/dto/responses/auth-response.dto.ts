import { Role } from '@generated-prisma/enums';

export class AuthResponseDto {
  accessToken!: string;
  refreshToken!: string;

  user!: {
    id: number;
    username: string;
    email: string;
    role: Role;
    avatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
