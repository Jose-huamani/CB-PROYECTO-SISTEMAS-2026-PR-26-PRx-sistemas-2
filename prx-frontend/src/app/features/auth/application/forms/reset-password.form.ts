import { FormlyFieldConfig } from '@ngx-formly/core';

import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';

export function buildResetPasswordFormFields(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'grid formgrid p-fluid -mx-2',
      fieldGroup: [
        {
          key: 'code',
          type: 'app-otp',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Código de verificación',
            required: true,
            length: AUTH_CONSTANTS.VERIFICATION.CODE_LENGTH,
            integerOnly: true,
            helperText: `Ingresa los ${AUTH_CONSTANTS.VERIFICATION.CODE_LENGTH} dígitos del código.`,
          },
        },
        {
          key: 'newPassword',
          type: 'app-password',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Nueva contraseña',
            placeholder: 'Ingresa tu nueva contraseña',
            required: true,
            minLength: 8,
            maxLength: 72,
            toggleMask: true,
            feedback: true,
          },
          validators: {
            validation: ['strongPassword'],
          },
        },
        {
          key: 'confirmPassword',
          type: 'app-password',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Confirmar contraseña',
            placeholder: 'Repite tu nueva contraseña',
            required: true,
            maxLength: 72,
            toggleMask: true,
            feedback: false,
            matchTo: 'newPassword',
          },
          validators: {
            validation: ['fieldMatch'],
          },
        },
      ],
    },
  ];
}
