import { Role } from "@generated-prisma/enums";

export type JwtBasePayload = {
  sub: number;
  email: string;
  username: string;
  role: Role;
};
