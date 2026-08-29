import { FormlyFieldConfig } from '@ngx-formly/core';

export function buildRegisterRequestFormFields(): FormlyFieldConfig[] {
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
            helperText: 'Usa un correo válido, por ejemplo: usuario@dominio.com.',
          },
          validators: {
            validation: ['emailWithTld'],
          },
        },
        {
          key: 'username',
          type: 'app-input',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Nombre de usuario',
            type: 'text',
            placeholder: 'Ingresa tu nombre de usuario',
            required: true,
            maxLength: 15,
            pKeyFilter: /^(?!.*--)[A-Za-z0-9-]+$/,
            forceLowercase: true,
            helperText: 'Sin espacios. Puedes usar letras, números y guiones (-).',
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
            minLength: 8,
            maxLength: 72,
            autocomplete: 'new-password',
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
            placeholder: 'Repite tu contraseña',
            required: true,
            maxLength: 72,
            autocomplete: 'new-password',
            toggleMask: true,
            feedback: false,
            matchTo: 'password',
          },
          validators: {
            validation: ['fieldMatch'],
          },
        },
      ],
    },
  ];
}
