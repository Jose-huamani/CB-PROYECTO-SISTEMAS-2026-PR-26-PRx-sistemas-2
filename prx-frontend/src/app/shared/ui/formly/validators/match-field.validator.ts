import { AbstractControl, ValidationErrors } from '@angular/forms';

export function matchFieldValidator(
  control: AbstractControl,
  matchTo: string,
): ValidationErrors | null {
  const parent = control.parent;

  if (!parent) {
    return null;
  }

  const targetControl = parent.get(matchTo);

  if (!targetControl) {
    return null;
  }

  if (!(targetControl as { __matchFieldSubscribed?: boolean }).__matchFieldSubscribed) {
    targetControl.valueChanges.subscribe(() => {
      control.updateValueAndValidity({ onlySelf: true });
    });

    (targetControl as { __matchFieldSubscribed?: boolean }).__matchFieldSubscribed = true;
  }

  const currentValue = control.value;
  const targetValue = targetControl.value;

  if (!currentValue) {
    return null;
  }

  return currentValue === targetValue ? null : { fieldMatch: true };
}
