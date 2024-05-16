import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dynamicDecimal' })

@Directive({
  selector: '[appDynamicDecimal]'
})
// ! set the number of decimal to enter based in the entity configuration 
export class DynamicDecimalDirective {
  @Input('appDynamicDecimal') decimalPlaces: number;
  entityFraction = +this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions');
  constructor(
    private el: ElementRef,
    private commonDataService: CommonService
    ) { }
  
  @HostListener('input', ['$event.target.value'])

  setDecimalPlaces(inputValue: string) {
    
    const inputData = +inputValue;
    // const enteredDecimalCount = inputData % 1 !== 0 ? inputData.toString().split('.')[1]?.length || 0 : 0;
    // if (enteredDecimalCount > this.entityFraction) {
    //   const fixedDecimal = inputData.toFixed(this.entityFraction);
    //   this.el.nativeElement.value = fixedDecimal;
    // }
    
    if (inputData) {
      const fixedDecimal =  `1.${this.decimalPlaces}-${this.decimalPlaces}`;
      this.el.nativeElement.value = fixedDecimal;
    }
  }

  // transform(value: number, decimalPlaces: number): string {
  //   debugger
  //   if (value || value === 0) {
  //     return value.toFixed(decimalPlaces);
  //   }
  //   return '';
  // }

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
