import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportReceiptVoucherComponent } from './report-receipt-voucher/report-receipt-voucher.component';
import { ReportPaymentVoucherComponent } from './report-payment-voucher/report-payment-voucher.component';
import { ReportContraVoucherComponent } from './report-contra-voucher/report-contra-voucher.component';
import { ReportVoucherReversalComponent } from './report-voucher-reversal/report-voucher-reversal.component';
import { ReportSalesVoucherComponent } from './report-sales-voucher/report-sales-voucher.component';
import { ReportAdjustmentVoucherComponent } from './report-adjustment-voucher/report-adjustment-voucher.component';
import { ReportJournalVoucherComponent } from './report-journal-voucher/report-journal-voucher.component';


@NgModule({
  declarations: [
    ReportReceiptVoucherComponent,
    ReportPaymentVoucherComponent,
    ReportContraVoucherComponent,
    ReportVoucherReversalComponent,
    ReportSalesVoucherComponent,
    ReportAdjustmentVoucherComponent,
    ReportJournalVoucherComponent
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
