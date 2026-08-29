import { FormlyFieldConfig } from '@ngx-formly/core';

import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';

export function buildConfirmRegisterFormFields(): FormlyFieldConfig[] {
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
      ],
    },
  ];
}
