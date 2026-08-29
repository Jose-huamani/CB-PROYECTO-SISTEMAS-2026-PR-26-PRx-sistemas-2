import { FormlyFieldConfig } from '@ngx-formly/core';

export function buildCreateNoteFormFields(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'grid formgrid p-fluid -mx-2',
      fieldGroup: [
        {
          key: 'title',
          type: 'app-input',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Título',
            type: 'text',
            placeholder: 'Ej: Mi nota importante',
            required: true,
            maxLength: 150,
            trim: true,
            normalizeSpaces: true,
          },
        },
        {
          key: 'content',
          type: 'app-textarea',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Contenido',
            placeholder: 'Ej: Descripción detallada de la nota',
            required: true,
            maxLength: 65535,
            rows: 6,
            trim: true,
            normalizeSpaces: true,
          },
        },
        {
          key: 'files',
          type: 'app-file-upload',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Archivos',
            required: false,
            chooseLabel: 'Seleccionar archivos',
            chooseIcon: 'pi pi-upload',
            multiple: true,
            maxFiles: 5,
            maxFileSize: 50 * 1024 * 1024,
          },
        },
      ],
    },
  ];
}
