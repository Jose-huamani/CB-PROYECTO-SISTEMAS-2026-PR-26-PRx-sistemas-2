import { Role } from '@shared/enums/role.enum';

export interface TokenPayloadModel {
  sub: number;
  email: string;
  username: string;
  role: Role;
  tokenType: string;
  iat?: number;
  exp?: number;
}
