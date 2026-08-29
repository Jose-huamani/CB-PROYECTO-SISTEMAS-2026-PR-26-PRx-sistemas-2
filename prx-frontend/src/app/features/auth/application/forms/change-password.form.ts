import { FormlyFieldConfig } from '@ngx-formly/core';

export function buildChangePasswordFormFields(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'grid formgrid p-fluid -mx-2',
      fieldGroup: [
        {
          key: 'currentPassword',
          type: 'app-password',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Contraseña actual',
            placeholder: 'Ingresa tu contraseña actual',
            required: true,
            maxLength: 72,
            toggleMask: true,
            feedback: false,
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
