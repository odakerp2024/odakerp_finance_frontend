import { FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonPatternService {
  pinCodePattern = '^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$';
  panPattern = '^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$';
  gstPattern = '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$';
  emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  cinPattern = '^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$';
  mobilePattern = '^((\\+91-?)|0)?[0-9]{10}$';
  telephonePattern = '^[1-9][0-9]*$';
  IFSCPattern = '^[A-Z]{4}0[A-Z0-9]{6}$';
  tanPattern = '[A-Z]{4}\d{5}[A-Z]{1}';
  pattern1 = '[A-Za-z]+';
  inputValue1 = 'Hello World';
  constructor() { }
  //  we are using this function patternValidation
  patternValidation(pattern, input) {
    const patternWithSlash = pattern.replace('"', '/');
    if (!patternWithSlash.test(input)) {
      return false;
    }
    return true;
  }

  validateWithPattern(pattern: any, inputValue: any) {
    const patternValidator = Validators.pattern(new RegExp(pattern));
    const isValid = patternValidator(new FormControl(inputValue));
    return isValid ? null : { invalidPattern: true };
  }

  // value.match(emailPattern)
}
