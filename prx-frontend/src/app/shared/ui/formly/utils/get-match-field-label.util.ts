import { FormlyFieldConfig } from '@ngx-formly/core';

export function getMatchFieldLabel(field: FormlyFieldConfig): string {
  const matchTo = field.props?.['matchTo'];

  if (!matchTo || typeof matchTo !== 'string') {
    return 'el campo requerido';
  }

  const siblingField = field.parent?.fieldGroup?.find((item) => item.key === matchTo);

  const siblingLabel = siblingField?.props?.['label'];

  if (typeof siblingLabel === 'string' && siblingLabel.trim().length > 0) {
    return siblingLabel.toLowerCase();
  }

  return 'el campo requerido';
}
