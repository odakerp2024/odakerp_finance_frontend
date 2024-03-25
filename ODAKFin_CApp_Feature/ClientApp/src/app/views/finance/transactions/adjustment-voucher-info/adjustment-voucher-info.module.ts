import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdjustmentVoucherInfoRoutingModule } from './adjustment-voucher-info-routing.module';
import { AdjustmentVoucherInfoComponent } from './adjustment-voucher-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [AdjustmentVoucherInfoComponent], 
  imports: [
    CommonModule,
    AdjustmentVoucherInfoRoutingModule,
    FormsModule, ReactiveFormsModule,SharedModule,NgSelectModule
  ]
})
export class AdjustmentVoucherInfoModule { }
