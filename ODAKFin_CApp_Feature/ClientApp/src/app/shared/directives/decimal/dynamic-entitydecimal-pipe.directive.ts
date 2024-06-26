
import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Pipe({
  name: 'dynamicentityDecimal'
})
export class DynamicEntityDecimalPipeDirective implements PipeTransform {
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
