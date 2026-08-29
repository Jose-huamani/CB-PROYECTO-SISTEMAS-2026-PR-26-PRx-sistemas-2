import { FormlyFieldConfig } from '@ngx-formly/core';

export function buildForgotPasswordFormFields(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'grid formgrid p-fluid -mx-2',
      fieldGroup: [
        {
          key: 'email',
          type: 'app-input',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Correo electrónico',
            type: 'email',
            placeholder: 'Ingresa tu correo electrónico',
            required: true,
            maxLength: 50,
            autocomplete: 'email',
            pKeyFilter: /^[^\s]+$/,
            forceLowercase: true,
            email: true,
            helperText: 'Te enviaremos instrucciones para recuperar tu contraseña.',
          },
          validators: {
            validation: ['emailWithTld'],
          },
        },
      ],
    },
  ];
}
