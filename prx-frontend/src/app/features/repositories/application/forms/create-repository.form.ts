import { FormlyFieldConfig } from '@ngx-formly/core';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

import { RepositoryCategoryModel } from '@features/repositories/domain/models/repository-category.model';
import { RepositoryVisibility } from '@shared/enums/repository-visibility.enum';

interface BuildCreateRepositoryFormFieldsOptions {
  categorySuggestions: RepositoryCategoryModel[];
  searchCategories: (event: AutoCompleteCompleteEvent) => void;
}

export function buildCreateRepositoryFormFields(
  options: BuildCreateRepositoryFormFieldsOptions,
): FormlyFieldConfig[] {
  return [
    {
      fieldGroupClassName: 'grid formgrid p-fluid -mx-2',
      fieldGroup: [
        {
          key: 'ownerUsername',
          type: 'app-input',
          className: 'col-12 md:col-4 px-2 mb-3',
          props: {
            label: 'Propietario',
            type: 'text',
            readonly: true,
            helperText: 'Usuario propietario del repositorio.',
          },
        },
        {
          key: 'name',
          type: 'app-input',
          className: 'col-12 md:col-8 px-2 mb-3',
          props: {
            label: 'Nombre del repositorio',
            type: 'text',
            placeholder: 'Un nombre claro y conciso ayuda a identificar tu repositorio...',
            required: true,
            minLength: 2,
            maxLength: 100,
            pKeyFilter: /^(?!.*--)[A-Za-z0-9-]+$/,
            forceLowercase: true,
            trim: true,
            helperText: 'Sin espacios. Puedes usar letras, números y guiones (-).',
          },
        },
        {
          key: 'description',
          type: 'app-textarea',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Descripción',
            placeholder: 'Describe brevemente el propósito del repositorio',
            required: false,
            maxLength: 1500,
            rows: 4,
            autoResize: true,
            trim: true,
            normalizeSpaces: true,
            helperText: 'Opcional. Máximo 1500 caracteres.',
          },
        },
        {
          key: 'category',
          type: 'app-autocomplete',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Categoría',
            placeholder: 'Ej: CIENCIA',
            required: true,
            minLength: 2,
            maxLength: 50,
            optionLabel: 'name',
            emptyMessage: 'No se encontraron categorías',
            showEmptyMessage: false,
            suggestions: options.categorySuggestions,
            completeMethod: options.searchCategories,
            pKeyFilter: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/,
            forceUppercase: true,
            normalizeSpaces: true,
            helperText:
              'Selecciona una categoría existente o escribe una nueva. Puedes usar letras, números y espacios.',
          },
        },
        {
          key: 'visibility',
          type: 'app-option-cards',
          className: 'col-12 px-2 mb-3',
          props: {
            label: 'Visibilidad',
            required: true,
            columns: 2,
            iconClass: 'text-3xl',
            options: [
              {
                label: 'Público',
                value: RepositoryVisibility.publico,
                description: 'Cualquier persona en Internet puede ver este repositorio.',
                icon: 'pi pi-globe',
              },
              {
                label: 'Privado',
                value: RepositoryVisibility.privado,
                description: 'Tú eliges quién puede ver y acceder a este repositorio.',
                icon: 'pi pi-lock',
              },
            ],
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
            helperText: 'Selecciona un color para identificar el repositorio.',
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
      ],
    },
  ];
}
