import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dynamicDecimal' })

@Directive({
  selector: '[dynamicDecimal]'
})
// ! set the number of decimal to enter based in the entity configuration 
export class DynamicDecimalPipeDirective {
  entityFraction = +this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions');
  constructor(
    private el: ElementRef,
    private commonDataService: CommonService
  ) { }

  @HostListener('input', ['$event.target.value'])

  transform(value: number | string, decimalPlaces: number): string {

    // Check if the value is empty or null
    if (value === '' || value === null) {
      return '0';
    }

    // Parse the input value to a number
    const numericValue = parseFloat(value as string);

    // Check if the parsed value is a valid number
    if (!isNaN(numericValue)) {
      // If the value is valid, format it with the specified number of decimal places
      return numericValue.toFixed(decimalPlaces);
    }

    // If the input value is not a valid number, return an empty string
    return '';
  }
}
