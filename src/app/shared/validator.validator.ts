import { ValidatorFn, AbstractControl } from '@angular/forms';

export function uniqueSerialNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    
    if (!control.value || !Array.isArray(control.value)) {
      return null;
    }

    const serialNumbers = control.value.map(item => item.serialNumber);
    const unique = new Set(serialNumbers).size === serialNumbers.length;

    return unique ? null : { nonUniqueSerialNumbers: true };
  };
}

