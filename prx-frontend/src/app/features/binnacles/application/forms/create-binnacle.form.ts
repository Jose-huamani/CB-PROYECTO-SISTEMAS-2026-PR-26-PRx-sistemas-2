import { FormlyFieldConfig } from '@ngx-formly/core';

export function buildCreateBinnacleFormFields(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'grid formgrid p-fluid -mx-2',
      fieldGroup: [
        {
          key: 'name',
          type: 'app-input',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Título de la bitácora',
            type: 'text',
            placeholder: 'Ej: Mi día en el trabajo',
            required: true,
            maxLength: 15,
            minLength: 2,
            trim: true,
            normalizeSpaces: true,
            helperText: 'El título debe tener entre 2 y 15 caracteres.',
          },
        },
        {
          key: 'content',
          type: 'app-textarea',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Contenido',
            placeholder: '¿Qué hiciste hoy?',
            required: true,
            maxLength: 2000,
            minLength: 1,
            rows: 5,
            autoResize: true,
            trim: true,
            normalizeSpaces: true,
            helperText: 'Describe lo que hiciste hoy (máximo 2000 caracteres).',
          },
        },
      ],
    },
  ];
}
