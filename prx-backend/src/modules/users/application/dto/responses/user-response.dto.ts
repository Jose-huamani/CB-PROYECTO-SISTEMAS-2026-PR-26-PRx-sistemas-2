import { Role } from '@generated-prisma/enums';

export class UserResponseDto {
  id!: number;
  username!: string;
  email!: string;
  role!: Role;
  avatarUrl!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
