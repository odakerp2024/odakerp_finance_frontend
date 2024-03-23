import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentVouchersRoutingModule } from './payment-vouchers-routing.module';
import { PaymentVoucherViewComponent } from './payment-voucher-view/payment-voucher-view.component';
import { PaymentVoucherDetailsComponent } from './payment-voucher-details/payment-voucher-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive.module';



@NgModule({
  declarations: [
    PaymentVoucherViewComponent,
    PaymentVoucherDetailsComponent
  ],
  imports: [
    CommonModule,
    PaymentVouchersRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    SharedModule,
    NgSelectModule,
    DirectiveModule
  ]
})
export class PaymentVouchersModule { }
