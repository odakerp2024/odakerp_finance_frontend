import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceiptVouchersRoutingModule } from './receipt-vouchers-routing.module';
import { ReceiptVouchersViewComponent } from './receipt-vouchers-view/receipt-vouchers-view.component';
import { ReceiptVoucherDetailsComponent } from './receipt-voucher-details/receipt-voucher-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ReceiptVouchersViewComponent,
    ReceiptVoucherDetailsComponent
  ],
  imports: [
    CommonModule,
    ReceiptVouchersRoutingModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class ReceiptVouchersModule { }
