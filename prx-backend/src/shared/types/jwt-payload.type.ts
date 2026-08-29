import { Role } from '@generated-prisma/enums';
import { TokenTypeEnum } from '@shared/enums/token-type.enum';

export type JwtPayload = {
  sub: number;
  email: string;
  username: string;
  role: Role;
  tokenType: TokenTypeEnum;
  iat?: number;
  exp?: number;
};
