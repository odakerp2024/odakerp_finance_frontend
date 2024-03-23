import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

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
    const enteredDecimalCount = inputData % 1 !== 0 ? inputData.toString().split('.')[1]?.length || 0 : 0;
    if (enteredDecimalCount > this.entityFraction) {
      const fixedDecimal = inputData.toFixed(this.entityFraction);
      this.el.nativeElement.value = fixedDecimal;
    }
  }

}
