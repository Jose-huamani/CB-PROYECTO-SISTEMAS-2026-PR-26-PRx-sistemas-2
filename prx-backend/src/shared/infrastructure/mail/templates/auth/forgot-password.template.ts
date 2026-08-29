import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';
import { codeEmailTemplate } from '@shared/infrastructure/mail/templates/partials/code-email.template';

export function forgotPasswordTemplate(code: string): string {
  return codeEmailTemplate({
    badge: 'Seguridad de cuenta',
    title: 'Restablecer contraseña',
    description:
      'Has solicitado restablecer tu contraseña. Usa el siguiente código para continuar con el proceso.',
    code,
    expirationText: `Este código expira en <strong style="color:#2D736C;">${AUTH_CONSTANTS.PASSWORD_RESET.EXPIRES_MINUTES} minutos</strong>.`,
    helperText:
      'Si no solicitaste este cambio, puedes ignorar este mensaje. Tu cuenta permanece segura.',
  });
}
