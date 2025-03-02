import { Directive } from '@angular/core';
import {AbstractControl, FormGroup, ValidationErrors, Validator} from "@angular/forms";

@Directive({
  selector: '[passwordsMatch]',
  standalone: true
})
export class MatchPasswordsDirective implements Validator {

  constructor() {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const parentGroup = control.parent as FormGroup;
    const password = parentGroup?.controls['password'].value;
    const confirmPassword = control.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

}
