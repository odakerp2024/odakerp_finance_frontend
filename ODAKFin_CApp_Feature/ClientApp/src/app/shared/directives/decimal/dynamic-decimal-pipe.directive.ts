// import { Directive, ElementRef, HostListener, Input } from '@angular/core';
// import { CommonService } from 'src/app/services/common.service';
// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({ name: 'dynamicDecimal' })

// // @Directive({
// //   selector: '[dynamicDecimal]'
// // })
// // ! set the number of decimal to enter based in the entity configuration 
// export class DynamicDecimalPipeDirective {
//   private entityFraction: number;
//   private entityThousands: number;

//   constructor(
//     private el: ElementRef,
//     private commonDataService: CommonService
//   ) {
//     // Fetch configuration values from local storage or service upon directive initialization
//     this.entityFraction = +this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions');
//     this.entityThousands = +this.commonDataService.getLocalStorageEntityConfigurable('CurrenecyFormat');
//   }

//   @HostListener('input', ['$event.target.value'])
//   onInput(value: string) {
//     // Check if the value is empty or null
//     if (!value) {
//       this.el.nativeElement.value = '0';
//       return;
//     }

//     // Parse the input value to a number
//     const numericValue = parseFloat(value);

//     // Check if the parsed value is a valid number
//     if (!isNaN(numericValue)) {
//       // Format the number based on entityThousands and entityFraction
//       const formattedValue = this.formatNumber(numericValue);
//       this.el.nativeElement.value = formattedValue;
//     } else {
//       // If the input value is not a valid number, clear the input field
//       this.el.nativeElement.value = '';
//     }
//   }

//   private formatNumber(value: number): string {
//     // Round the number to the specified decimal places
//     const roundedValue = value.toFixed(this.entityFraction);

//     // Convert to string for further formatting
//     let stringValue = roundedValue.toString();

//     // Split into integer and decimal parts
//     const parts = stringValue.split('.');
//     let integerPart = parts[0];
//     let decimalPart = parts.length > 1 ? '.' + parts[1] : '';

//     // Reverse the integer part to format from right to left
//     let reversedInteger = integerPart.split('').reverse().join('');

//     // Add thousands separators every two digits
//     let formattedInteger = reversedInteger.match(/\d{1,2}/g).join(',').split('').reverse().join('');

//     // Concatenate integer and decimal parts
//     return formattedInteger + decimalPart;
//   }
// }
import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Pipe({
  name: 'dynamicDecimal'
})
export class DynamicDecimalPipeDirective implements PipeTransform {
  private entityFraction: number;
  private entityThousands: string;

  constructor(private commonDataService: CommonService) {
    this.entityFraction = +this.commonDataService.getLocalStorageEntityConfigurable('NoOfFractions');
    this.entityThousands = this.extractFormat(this.commonDataService.getLocalStorageEntityConfigurable('CurrenecyFormat'));
  }

  transform(value: any): string {
    if (value === null || value === undefined || value === '') {
      return '0';
    }

    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[{}]/g, '').replace(/,/g, '')) : value;

    if (!isNaN(numericValue)) {
      const formattedValue = this.formatNumber(numericValue);
      return formattedValue;
    } else {
      return '';
    }
  }

  private extractFormat(formatString: string): string {
    const match = formatString.match(this.entityThousands);
    return match ? match[1] : this.entityThousands; // Default format if not matched
  }

  private formatNumber(value: number): string {
    // Check if the number has decimal places
    const hasDecimal = value % 1 !== 0;

    // Determine decimal places based on backend indication
    const decimalPlaces = hasDecimal ? this.entityFraction : 0;

    // Format the number with appropriate decimal places
    const roundedValue = value.toFixed(decimalPlaces);
    const parts = roundedValue.split('.');
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? '.' + parts[1] : '';

    // Format integer part according to Indian numbering system
    const lastThree = integerPart.slice(-3);
    const otherNumbers = integerPart.slice(0, -3);

    const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;

    // Remove leading comma if it exists
    const finalFormattedInteger = formattedInteger.startsWith(',') ? formattedInteger.slice(1) : formattedInteger;

    return finalFormattedInteger + decimalPart;
  }
}
