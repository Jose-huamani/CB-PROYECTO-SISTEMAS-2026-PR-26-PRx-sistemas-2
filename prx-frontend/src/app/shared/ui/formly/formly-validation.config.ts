import { ConfigOption, FormlyFieldConfig } from '@ngx-formly/core';

import { getMatchFieldLabel } from '@shared/ui/formly/utils/get-match-field-label.util';

import { emailWithTldValidator } from '@shared/ui/formly/validators/email-with-tld.validator';
import { matchFieldValidator } from '@shared/ui/formly/validators/match-field.validator';
import { maxArrayItemsValidator } from '@shared/ui/formly/validators/max-array-items.validator';
import { strongPasswordValidator } from '@shared/ui/formly/validators/strong-password.validator';

export const APP_FORMLY_VALIDATION_CONFIG: ConfigOption = {
  validationMessages: [
    {
      name: 'required',
      message: () => 'Este campo es obligatorio',
    },
    {
      name: 'minLength',
      message: (_error, field: FormlyFieldConfig) =>
        `Debe tener al menos ${field.props?.minLength} caracteres`,
    },
    {
      name: 'maxLength',
      message: (_error, field: FormlyFieldConfig) =>
        `No puede superar ${field.props?.maxLength} caracteres`,
    },
    {
      name: 'pattern',
      message: () => 'Formato inválido',
    },
    {
      name: 'email',
      message: () => 'Correo electrónico inválido',
    },
    {
      name: 'min',
      message: (_error, field: FormlyFieldConfig) =>
        `El valor debe ser mayor o igual a ${field.props?.min}`,
    },
    {
      name: 'max',
      message: (_error, field: FormlyFieldConfig) =>
        `El valor debe ser menor o igual a ${field.props?.max}`,
    },
    {
      name: 'emailWithTld',
      message: () => 'Ingresa un correo electrónico válido (ejemplo@dominio.com)',
    },
    {
      name: 'fieldMatch',
      message: (_error, field: FormlyFieldConfig) =>
        `Debe coincidir con ${getMatchFieldLabel(field)}`,
    },
    {
      name: 'strongPassword',
      message: () =>
        'Debe incluir mayúscula, minúscula, número, carácter especial y mínimo 8 caracteres',
    },
    {
      name: 'maxArrayItems',
      message: (_error, field: FormlyFieldConfig) =>
        `No puedes agregar más de ${field.props?.['maxItems']} elementos`,
    },
  ],

  validators: [
    {
      name: 'emailWithTld',
      validation: emailWithTldValidator,
    },
    {
      name: 'fieldMatch',
      validation: (control, field) => {
        const matchTo = field.props?.['matchTo'];

        if (!matchTo || typeof matchTo !== 'string') {
          return null;
        }

        return matchFieldValidator(control, matchTo);
      },
    },
    {
      name: 'strongPassword',
      validation: strongPasswordValidator,
    },
    {
      name: 'maxArrayItems',
      validation: maxArrayItemsValidator,
    },
  ],
};
