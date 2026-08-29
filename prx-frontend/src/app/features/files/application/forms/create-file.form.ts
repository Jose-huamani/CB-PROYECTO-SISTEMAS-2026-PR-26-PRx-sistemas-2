import { FormlyFieldConfig } from '@ngx-formly/core';

export function buildCreateFileFormFields(): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'grid formgrid p-fluid -mx-2',
      fieldGroup: [
        {
          key: 'name',
          type: 'app-input',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Nombre del archivo',
            type: 'text',
            placeholder: 'Ej: Reporte final 2026',
            required: true,
            maxLength: 255,
            pKeyFilter: /^[^\\/:*?"<>|]+$/,
            trim: true,
            normalizeSpaces: true,
            helperText: 'Máximo 255 caracteres. No puede contener \\ / : * ? " < > |.',
          },
        },
        {
          key: 'tags',
          type: 'app-autocomplete',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Etiquetas',
            placeholder: 'Ej: reporte, datos',
            pKeyFilter: /^(?!.*--)[A-Za-z0-9-]+$/,
            required: false,
            multiple: true,
            typeahead: false,
            addOnBlur: true,
            addOnTab: true,
            separator: ',',
            unique: true,
            maxItems: 5,
            itemMaxLength: 25,
            forceLowercase: true,
            trim: true,
            normalizeSpaces: true,
            helperText:
              'Opcional. Máximo 5 etiquetas. Sin espacios; usa letras, números y guiones (-). Agrega con coma, Tab o saliendo del campo.',
          },
          validators: {
            validation: ['maxArrayItems'],
          },
        },
        {
          key: 'file',
          type: 'app-file-upload',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Archivo',
            required: true,
            chooseLabel: 'Seleccionar archivo',
            chooseIcon: 'pi pi-upload',
            multiple: false,
            maxFiles: 1,
            maxFileSize: 50 * 1024 * 1024,
            helperText: 'Selecciona un archivo para subir al repositorio.',
          },
        },
      ],
    },
  ];
}
