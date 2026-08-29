import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

export function maxArrayItemsValidator(
  control: AbstractControl,
  field?: FormlyFieldConfig,
): ValidationErrors | null {
  const value = control.value;

  if (!Array.isArray(value)) {
    return null;
  }

  const maxItems = field?.props?.['maxItems'];

  if (typeof maxItems !== 'number') {
    return null;
  }

  return value.length <= maxItems ? null : { maxArrayItems: true };
}
