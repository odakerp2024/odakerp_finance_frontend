import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive.module';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportReceiptVoucherComponent } from './report-receipt-voucher/report-receipt-voucher.component';


@NgModule({
  declarations: [
    ReportReceiptVoucherComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    SharedModule,
    NgSelectModule,
    DirectiveModule
  ]
})
export class ReportsModule { }
