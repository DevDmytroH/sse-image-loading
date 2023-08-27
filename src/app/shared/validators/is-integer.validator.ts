import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isIntegerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value + '';

    const isInteger = /^-?\d+$/.test(value);

    return isInteger ? null : { notInteger: { value: value } };
  };
}
