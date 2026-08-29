import { Global, Module } from '@nestjs/common';
import { MailService } from '@shared/infrastructure/mail/mail.service';

@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
