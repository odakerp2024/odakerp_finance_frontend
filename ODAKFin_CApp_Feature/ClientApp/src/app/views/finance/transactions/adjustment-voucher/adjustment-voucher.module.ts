import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdjustmentVoucherRoutingModule } from './adjustment-voucher-routing.module';
import { AdjustmentVoucherComponent } from './adjustment-voucher.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [AdjustmentVoucherComponent],
  imports: [
    CommonModule,
    AdjustmentVoucherRoutingModule,
    FormsModule, ReactiveFormsModule,SharedModule,NgSelectModule
  ]
})
export class AdjustmentVoucherModule { }
