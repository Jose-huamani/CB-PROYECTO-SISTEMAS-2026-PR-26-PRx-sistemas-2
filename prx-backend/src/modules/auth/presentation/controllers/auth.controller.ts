import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ChangePasswordCommand } from '@modules/auth/application/commands/change-password/change-password.command';
import { ConfirmRegisterCommand } from '@modules/auth/application/commands/confirm-register/confirm-register.command';
import { ForgotPasswordCommand } from '@modules/auth/application/commands/forgot-password/forgot-password.command';
import { LoginCommand } from '@modules/auth/application/commands/login/login.command';
import { LogoutCommand } from '@modules/auth/application/commands/logout/logout.command';
import { RefreshTokenCommand } from '@modules/auth/application/commands/refresh-token/refresh-token.command';
import { RegisterRequestCommand } from '@modules/auth/application/commands/register-request/register-request.command';
import { ResendVerificationCodeCommand } from '@modules/auth/application/commands/resend-verification-code/resend-verification-code.command';
import { ResetPasswordCommand } from '@modules/auth/application/commands/reset-password/reset-password.command';

import { ChangePasswordDto } from '@modules/auth/application/dto/requests/change-password.dto';
import { ConfirmRegisterDto } from '@modules/auth/application/dto/requests/confirm-register.dto';
import { ForgotPasswordDto } from '@modules/auth/application/dto/requests/forgot-password.dto';
import { LoginDto } from '@modules/auth/application/dto/requests/login.dto';
import { LogoutDto } from '@modules/auth/application/dto/requests/logout.dto';
import { RefreshTokenDto } from '@modules/auth/application/dto/requests/refresh-token.dto';
import { RegisterRequestDto } from '@modules/auth/application/dto/requests/register-request.dto';
import { ResendCodeDto } from '@modules/auth/application/dto/requests/resend-code.dto';
import { ResetPasswordDto } from '@modules/auth/application/dto/requests/reset-password.dto';

import { MeQuery } from '@modules/auth/application/queries/me/me.query';

import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { Public } from '@shared/presentation/decorators/public.decorator';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Post('register-request')
  @HttpCode(HttpStatus.CREATED)
  registerRequest(@Body() dto: RegisterRequestDto) {
    return this.commandBus.execute(new RegisterRequestCommand(dto));
  }

  @Public()
  @Post('confirm-register')
  @HttpCode(HttpStatus.CREATED)
  confirmRegister(@Body() dto: ConfirmRegisterDto) {
    return this.commandBus.execute(new ConfirmRegisterCommand(dto));
  }

  @Public()
  @Post('resend-verification-code')
  @HttpCode(HttpStatus.OK)
  resendVerificationCode(@Body() dto: ResendCodeDto) {
    return this.commandBus.execute(new ResendVerificationCodeCommand(dto));
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() dto: LoginDto,
    @Headers('user-agent') userAgent?: string,
    @Ip() ipAddress?: string,
  ) {
    return this.commandBus.execute(new LoginCommand(dto, userAgent, ipAddress));
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.commandBus.execute(new RefreshTokenCommand(dto));
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.commandBus.execute(new ForgotPasswordCommand(dto));
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.commandBus.execute(new ResetPasswordCommand(dto));
  }

  @ApiBearerAuth()
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(new ChangePasswordCommand(dto, userId));
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() dto: LogoutDto) {
    return this.commandBus.execute(new LogoutCommand(dto));
  }

  @ApiBearerAuth()
  @SkipThrottle()
  @Get('me')
  @HttpCode(HttpStatus.OK)
  me(@CurrentUser('sub') userId: number) {
    return this.queryBus.execute(new MeQuery(userId));
  }
}
