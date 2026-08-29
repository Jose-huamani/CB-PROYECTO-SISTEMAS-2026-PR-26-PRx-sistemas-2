import { FormlyFieldConfig } from '@ngx-formly/core';

export function buildLoginFormFields(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'grid formgrid p-fluid -mx-2',
      fieldGroup: [
        {
          key: 'identifier',
          type: 'app-input',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Correo o nombre de usuario',
            type: 'text',
            placeholder: 'Ingresa tu correo o nombre de usuario',
            required: true,
            maxLength: 50,
            pKeyFilter: /^[^\s]+$/,
            autocomplete: 'on',
            forceLowercase: true,
            helperText: 'Puedes usar tu correo o nombre de usuario.',
          },
        },
        {
          key: 'password',
          type: 'app-password',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Contraseña',
            placeholder: 'Ingresa tu contraseña',
            required: true,
            maxLength: 72,
            autocomplete: 'current-password',
            toggleMask: true,
            feedback: false,
          },
        },
      ],
    },
  ];
}
