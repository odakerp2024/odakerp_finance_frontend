import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportReceiptVoucherComponent } from './report-receipt-voucher/report-receipt-voucher.component';
import { ReportPaymentVoucherComponent } from './report-payment-voucher/report-payment-voucher.component';
import { ReportContraVoucherComponent } from './report-contra-voucher/report-contra-voucher.component';
import { ReportVoucherReversalComponent } from './report-voucher-reversal/report-voucher-reversal.component';
import { ReportSalesVoucherComponent } from './report-sales-voucher/report-sales-voucher.component';
import { ReportJournalVoucherComponent } from './report-journal-voucher/report-journal-voucher.component';
import { ReportAdjustmentVoucherComponent } from './report-adjustment-voucher/report-adjustment-voucher.component';
import { ReportDayBookComponent } from './report-day-book/report-day-book.component';
import { ReportPurchaseVoucherComponent } from './report-purchase-voucher/report-purchase-voucher.component';
import { ReportArLeveloneComponent } from './report-ar-levelone/report-ar-levelone.component';
import { ReportArLeveltwoComponent } from './report-ar-leveltwo/report-ar-leveltwo.component';
import { ReportArLevelthreeComponent } from './report-ar-levelthree/report-ar-levelthree.component';
import { ReportApLeveloneComponent } from './report-ap-levelone/report-ap-levelone.component';
import { ReportApLeveltwoComponent } from './report-ap-leveltwo/report-ap-leveltwo.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'report-receipt-voucher' },
  { path: 'report-receipt-voucher'      ,  component : ReportReceiptVoucherComponent },
  { path: 'report-payment-voucher'      ,  component : ReportPaymentVoucherComponent},
  { path: 'report-contra-voucher'       ,  component : ReportContraVoucherComponent},
  { path: 'report-voucher-reversal'     ,  component : ReportVoucherReversalComponent},
  { path: 'report-sales-voucher'        ,  component : ReportSalesVoucherComponent},
  { path: 'report-journal-voucher'      ,  component : ReportJournalVoucherComponent },
  { path: 'report-adjustment-voucher'   ,  component : ReportAdjustmentVoucherComponent },
  { path: 'report-day-book'             ,  component : ReportDayBookComponent },
  { path: 'report-purchase-voucher'     ,  component : ReportPurchaseVoucherComponent},
  { path: 'report-ar-levelone'          ,  component : ReportArLeveloneComponent },
  { path: 'report-ar-leveltwo'          ,  component : ReportArLeveltwoComponent },
  { path: 'report-ar-levelthree'        ,  component : ReportArLevelthreeComponent},
  { path: 'report-ap-levelone'          ,  component : ReportApLeveloneComponent},
  { path: 'report-ap-leveltwo'          ,  component : ReportApLeveltwoComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
