import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[RemoveSpecialChars]'
})
export class RemoveSpecialCharsDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    // Use a regular expression to remove special characters and alphabets
    const filteredValue = inputValue.replace(/[^0-9]/g, ''); // Keep only numeric characters

    // Update the input element's value with the filtered text
    inputElement.value = filteredValue;
  }
}
