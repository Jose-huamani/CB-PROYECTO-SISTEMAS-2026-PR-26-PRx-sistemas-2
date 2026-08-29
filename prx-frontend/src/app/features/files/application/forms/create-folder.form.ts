import { FormlyFieldConfig } from '@ngx-formly/core';

export function buildCreateFolderFormFields(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'grid formgrid p-fluid -mx-2',
      fieldGroup: [
        {
          key: 'name',
          type: 'app-input',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Nombre de la carpeta',
            type: 'text',
            placeholder: 'Ej: Documentos',
            required: true,
            maxLength: 100,
            pKeyFilter: /^[^\\/:*?"<>|]+$/,
            trim: true,
            normalizeSpaces: true,
            helperText: 'Máximo 100 caracteres. No puede contener \\ / : * ? " < > |.',
          },
        },
        {
          key: 'color',
          type: 'app-color-options',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Color',
            required: true,
            showLabels: false,
            options: [
              {
                label: 'Verde menta',
                value: 'C9E4DE',
              },
              {
                label: 'Amarillo pálido',
                value: 'FAEDCB',
              },
              {
                label: 'Azul claro',
                value: 'C6DEF1',
              },
              {
                label: 'Lavanda',
                value: 'DBCDF0',
              },
              {
                label: 'Rosado suave',
                value: 'F2C6DE',
              },
              {
                label: 'Durazno',
                value: 'F7D9C4',
              },
            ],
            helperText: 'Selecciona un color para identificar la carpeta.',
          },
        },
      ],
    },
  ];
}
