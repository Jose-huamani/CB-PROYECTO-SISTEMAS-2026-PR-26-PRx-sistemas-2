import { AbstractControl, ValidationErrors } from '@angular/forms';

const EMAIL_WITH_TLD_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailWithTldValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  return EMAIL_WITH_TLD_REGEX.test(value) ? null : { emailWithTld: true };
}
