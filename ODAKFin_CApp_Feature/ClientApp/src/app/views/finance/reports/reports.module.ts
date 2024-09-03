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
import { ReportDayBookComponent } from './report-day-book/report-day-book.component';
import { ReportPurchaseVoucherComponent } from './report-purchase-voucher/report-purchase-voucher.component';
import { ReportArLeveloneComponent } from './report-ar-levelone/report-ar-levelone.component';
import { ReportArLeveltwoComponent } from './report-ar-leveltwo/report-ar-leveltwo.component';
import { ReportArLevelthreeComponent } from './report-ar-levelthree/report-ar-levelthree.component';
import { ReportApLeveloneComponent } from './report-ap-levelone/report-ap-levelone.component';
import { ReportApLeveltwoComponent } from './report-ap-leveltwo/report-ap-leveltwo.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';


@NgModule({
  declarations: [
    ReportReceiptVoucherComponent,
    ReportPaymentVoucherComponent,
    ReportContraVoucherComponent,
    ReportVoucherReversalComponent,
    ReportSalesVoucherComponent,
    ReportAdjustmentVoucherComponent,
    ReportJournalVoucherComponent,
    ReportDayBookComponent,
    ReportPurchaseVoucherComponent,
    ReportArLeveloneComponent,
    ReportArLeveltwoComponent,
    ReportArLevelthreeComponent,
    ReportApLeveloneComponent,
    ReportApLeveltwoComponent,
    ProfitLossComponent
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
