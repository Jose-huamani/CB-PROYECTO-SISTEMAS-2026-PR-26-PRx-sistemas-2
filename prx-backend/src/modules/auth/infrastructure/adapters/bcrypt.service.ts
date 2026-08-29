import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';

@Injectable()
export class BcryptService {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, AUTH_CONSTANTS.SECURITY.BCRYPT_SALT_ROUNDS);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
