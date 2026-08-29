import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';
import { codeEmailTemplate } from '@shared/infrastructure/mail/templates/partials/code-email.template';

export function registerRequestTemplate(code: string): string {
  return codeEmailTemplate({
    badge: 'Verificación de cuenta',
    title: 'Verifica tu correo electrónico',
    description:
      'Gracias por registrarte en PRX. Para completar tu registro, ingresa el siguiente código de verificación.',
    code,
    expirationText: `Este código es válido por <strong style="color:#2D736C;">${AUTH_CONSTANTS.VERIFICATION.EXPIRES_MINUTES} minutos</strong>.`,
    helperText:
      'Si no has creado una cuenta en PRX, puedes ignorar este mensaje.',
  });
}
