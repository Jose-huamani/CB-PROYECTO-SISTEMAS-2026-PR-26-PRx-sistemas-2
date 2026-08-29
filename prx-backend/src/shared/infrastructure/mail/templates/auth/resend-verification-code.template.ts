import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';
import { codeEmailTemplate } from '@shared/infrastructure/mail/templates/partials/code-email.template';

export function resendVerificationCodeTemplate(code: string): string {
  return codeEmailTemplate({
    badge: 'Nuevo código',
    title: 'Nuevo código de verificación',
    description:
      'Has solicitado un nuevo código de verificación. Usa el siguiente código para continuar con el proceso.',
    code,
    expirationText: `Este código expira en <strong style="color:#2D736C;">${AUTH_CONSTANTS.VERIFICATION.EXPIRES_MINUTES} minutos</strong>.`,
    helperText:
      'Si tienes problemas para verificar tu cuenta, revisa tu carpeta de spam o solicita otro código.',
  });
}
