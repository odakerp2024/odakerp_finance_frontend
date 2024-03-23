import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoaNumberRangeRoutingModule } from './coa-number-range-routing.module';
import { CoaNumberRangeComponent } from './coa-number-range.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [CoaNumberRangeComponent],
  imports: [
    CommonModule,
    CoaNumberRangeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class CoaNumberRangeModule { }
