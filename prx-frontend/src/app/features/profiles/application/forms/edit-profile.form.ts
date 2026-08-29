import { FormlyFieldConfig } from '@ngx-formly/core';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

interface BuildEditProfileFormFieldsOptions {
  countries: { id: number; name: string }[];
  tagSuggestions: { id: number; name: string }[];
  searchTags: (event: AutoCompleteCompleteEvent) => void;
}

export function buildEditProfileFormFields(
  options: BuildEditProfileFormFieldsOptions = {
    countries: [],
    tagSuggestions: [],
    searchTags: () => { },
  },
): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'grid formgrid p-fluid -mx-2',
      fieldGroup: [
        {
          key: 'firstName',
          type: 'app-input',
          className: 'col-12 md:col-4 px-2 mb-3',
          props: {
            label: 'Nombre',
            type: 'text',
            placeholder: 'Escribe tu nombre',
            required: true,
            maxLength: 60,
            trim: true,
            normalizeSpaces: true,
            pKeyFilter: /^[a-zA-ZÁÉÍÓÚáéíóúÑñ]+$/,
            helperText: 'Campo obligatorio.',
          },
        },
        {
          key: 'lastName',
          type: 'app-input',
          className: 'col-12 md:col-4 px-2 mb-3',
          props: {
            label: 'Primer apellido',
            type: 'text',
            placeholder: 'Escribe tu apellido',
            required: true,
            maxLength: 60,
            trim: true,
            normalizeSpaces: true,
            pKeyFilter: /^[a-zA-ZÁÉÍÓÚáéíóúÑñ]+$/,
            helperText: 'Campo obligatorio.',
          },
        },
        {
          key: 'secondLastName',
          type: 'app-input',
          className: 'col-12 md:col-4 px-2 mb-3',
          props: {
            label: 'Segundo apellido',
            helperText: 'Opcional.',
            type: 'text',
            placeholder: 'Escribe tu segundo apellido',
            maxLength: 60,
            trim: true,
            normalizeSpaces: true,
            pKeyFilter: /^[a-zA-ZÁÉÍÓÚáéíóúÑñ]+$/,
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'grid formgrid p-fluid -mx-2',
      fieldGroup: [
        {
          key: 'email',
          type: 'app-input',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Correo',
            type: 'email',
            placeholder: 'Tu correo',
            readonly: true,
            disabled: true,
          },
        },
        {
          key: 'isEmailVisible',
          type: 'checkbox',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Mostrar correo públicamente',
          },
        },
        {
          key: 'phoneCodeId',
          type: 'app-select',
          className: 'col-12 md:col-4 px-2 mb-3',
          props: {
            label: 'Código de país',
            placeholder: 'Selecciona',
            options: options.countries,
            optionLabel: 'label',
            optionValue: 'id',
            required: true,
            filter: true,
            showClear: true,
            helperText: 'Selecciona un código de país; el prefijo + va asociado a esta selección.',
          },
        },
        {
          key: 'phoneNumber',
          type: 'app-input',
          className: 'col-12 md:col-8 px-2 mb-3',
          props: {
            label: 'Número',
            type: 'tel',
            placeholder: 'Escribe tu numero.',
            required: true,
            maxLength: 20,
            trim: true,
            normalizeSpaces: true,
            pKeyFilter: /^[0-9]+$/,
            helperText: 'Campo obligatorio.',
          },
        },
        {
          key: 'biography',
          type: 'app-textarea',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Biografía',
            placeholder: 'Añade una descripcion sobre ti.',
            required: false,
            maxLength: 2000,
            rows: 4,
            trim: true,
            normalizeSpaces: true,
            helperText: 'Opcional. Cuéntanos un poco sobre ti.',
          },
        },
        {
          key: 'tags',
          type: 'app-autocomplete',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Etiquetas',
            placeholder: 'Ej: planetas, gravedad',
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
            suggestions: options.tagSuggestions,
            completeMethod: options.searchTags,
            forceLowercase: true,
            trim: true,
            normalizeSpaces: true,
            emptyMessage: 'No se encontraron etiquetas',
            showEmptyMessage: false,
            helperText:
              'Opcional. Máximo 5 etiquetas. Sin espacios; usa letras, números y guiones (-). Agrega con coma, Tab o saliendo del campo.',
          },
          validators: {
            validation: ['maxArrayItems'],
          },
        },

      ],
    },
    {
      fieldGroupClassName: 'grid formgrid p-fluid -mx-2',
      fieldGroup: [
        {
          key: 'countryId',
          type: 'app-select',
          className: 'col-12 md:col-4 px-2 mb-3',
          props: {
            label: 'País',
            placeholder: 'Selecciona tu país',
            options: options.countries,
            optionLabel: 'name',
            optionValue: 'id',
            required: false,
            filter: true,
            showClear: true,
          },
        },
        {
          key: 'regionName',
          type: 'app-input',
          className: 'col-12 md:col-4 px-2 mb-3',
          props: {
            label: 'Región',
            type: 'text',
            placeholder: 'Ej. Cochabamba',
            required: false,
            trim: true,
            normalizeSpaces: true,
          },
        },
        {
          key: 'townName',
          type: 'app-input',
          className: 'col-12 md:col-4 px-2 mb-3',
          props: {
            label: 'Ciudad',
            type: 'text',
            placeholder: 'Ej. Cercado',
            required: false,
            trim: true,
            normalizeSpaces: true,
          },
        },
      ],
    },
  ];
}
