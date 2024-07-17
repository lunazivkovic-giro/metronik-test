import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { uniqueSerialNumbersValidator } from '../validator.validator';

@Directive({
  selector: '[appUniqueSerialNumbers]',
  providers: [{provide: NG_VALIDATORS, useExisting: UniqueSerialNumbersDirective, multi: true}]
})
export class UniqueSerialNumbersDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return uniqueSerialNumbersValidator()(control);
  }
}


