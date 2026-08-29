import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '@modules/users/users.module';

import { AuthController } from '@modules/auth/presentation/controllers/auth.controller';

import { ChangePasswordHandler } from '@modules/auth/application/commands/change-password/change-password.handler';
import { ConfirmRegisterHandler } from '@modules/auth/application/commands/confirm-register/confirm-register.handler';
import { ForgotPasswordHandler } from '@modules/auth/application/commands/forgot-password/forgot-password.handler';
import { LoginHandler } from '@modules/auth/application/commands/login/login.handler';
import { LogoutHandler } from '@modules/auth/application/commands/logout/logout.handler';
import { RefreshTokenHandler } from '@modules/auth/application/commands/refresh-token/refresh-token.handler';
import { RegisterRequestHandler } from '@modules/auth/application/commands/register-request/register-request.handler';
import { ResendVerificationCodeHandler } from '@modules/auth/application/commands/resend-verification-code/resend-verification-code.handler';
import { ResetPasswordHandler } from '@modules/auth/application/commands/reset-password/reset-password.handler';
import { MeHandler } from '@modules/auth/application/queries/me/me.handler';

import { PasswordResetRepository } from '@modules/auth/domain/repositories/password-reset.repository';
import { RefreshTokenRepository } from '@modules/auth/domain/repositories/refresh-token.repository';
import { SessionRepository } from '@modules/auth/domain/repositories/session.repository';
import { VerificationCodeRepository } from '@modules/auth/domain/repositories/verification-code.repository';

import { BcryptService } from '@modules/auth/infrastructure/adapters/bcrypt.service';
import { JwtTokenService } from '@modules/auth/infrastructure/adapters/jwt-token.service';
import { VerificationCodeService } from '@modules/auth/infrastructure/adapters/verification-code.service';

import { PrismaPasswordResetRepository } from '@modules/auth/infrastructure/persistence/prisma-password-reset.repository';
import { PrismaRefreshTokenRepository } from '@modules/auth/infrastructure/persistence/prisma-refresh-token.repository';
import { PrismaSessionRepository } from '@modules/auth/infrastructure/persistence/prisma-session.repository';
import { PrismaVerificationCodeRepository } from '@modules/auth/infrastructure/persistence/prisma-verification-code.repository';

import { AvatarService } from '@shared/infrastructure/avatar/avatar.service';
import { CustomThrottlerGuard } from '@shared/presentation/guards/custom-throttler.guard';
import { JwtAuthGuard } from '@shared/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@shared/presentation/guards/roles.guard';

@Module({
  imports: [CqrsModule, JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [
    BcryptService,
    JwtTokenService,
    VerificationCodeService,
    AvatarService,

    RegisterRequestHandler,
    ConfirmRegisterHandler,
    ResendVerificationCodeHandler,
    LoginHandler,
    RefreshTokenHandler,
    LogoutHandler,
    ForgotPasswordHandler,
    ResetPasswordHandler,
    ChangePasswordHandler,
    MeHandler,

    {
      provide: VerificationCodeRepository,
      useClass: PrismaVerificationCodeRepository,
    },
    {
      provide: PasswordResetRepository,
      useClass: PrismaPasswordResetRepository,
    },
    {
      provide: SessionRepository,
      useClass: PrismaSessionRepository,
    },
    {
      provide: RefreshTokenRepository,
      useClass: PrismaRefreshTokenRepository,
    },

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AuthModule {}
