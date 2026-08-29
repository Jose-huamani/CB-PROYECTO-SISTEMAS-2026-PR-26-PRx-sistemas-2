import { AbstractControl, ValidationErrors } from '@angular/forms';

import { PASSWORD_STRONG_REGEX } from '@shared/constants/password.constants';

export function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  return PASSWORD_STRONG_REGEX.test(value) ? null : { strongPassword: true };
}
