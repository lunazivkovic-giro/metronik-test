import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function gtinValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value && value.length === 14 ? null : { invalidGtin: true };
  };
}

export function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return Number.isInteger(+value) ? null : { invalidInteger: true };
  };
}