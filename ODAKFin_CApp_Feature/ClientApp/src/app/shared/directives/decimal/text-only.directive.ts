import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextOnly]'
})
export class TextOnlyDirective {
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [8, 9, 13, 27, 46]; // Allow backspace, tab, enter, escape, delete keys
    if (
      !allowedKeys.includes(event.keyCode) && // Check if the pressed key is not in the allowedKeys array
      (event.keyCode >= 48 && event.keyCode <= 57) // Check if the pressed key is a number key
    ) {
      event.preventDefault(); // Prevent the keypress from being processed
    }
  }

}
