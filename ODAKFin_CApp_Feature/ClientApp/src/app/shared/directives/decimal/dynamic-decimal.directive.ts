import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({ name: 'dynamicDecimal' })

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

    const regex = new RegExp(`^\\d*(\\.\\d{0,${this.entityFraction}})?$`);

    if (!regex.test(inputValue)) {
      let inputData = inputValue;
      if (inputData.includes('.')) {
        const [integerPart, decimalPart] = inputData.split('.');
        const truncatedDecimal = decimalPart.substring(0, this.entityFraction);
        inputData = `${integerPart}.${truncatedDecimal}`;
      } else {
        inputData = inputValue;
      }
      this.el.nativeElement.value = inputData;
    }
  }
}
