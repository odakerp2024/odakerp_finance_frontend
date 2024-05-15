import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportReceiptVoucherComponent } from './report-receipt-voucher/report-receipt-voucher.component';
import { ReportPaymentVoucherComponent } from './report-payment-voucher/report-payment-voucher.component';
import { ReportContraVoucherComponent } from './report-contra-voucher/report-contra-voucher.component';
import { ReportVoucherReversalComponent } from './report-voucher-reversal/report-voucher-reversal.component';
import { ReportSalesVoucherComponent } from './report-sales-voucher/report-sales-voucher.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'report-receipt-voucher' },
  { path: 'report-receipt-voucher'  ,  component : ReportReceiptVoucherComponent },
  { path: 'report-payment-voucher'  ,  component : ReportPaymentVoucherComponent},
  { path: 'report-contra-voucher'   ,  component : ReportContraVoucherComponent},
  { path: 'report-voucher-reversal' ,  component : ReportVoucherReversalComponent},
  { path: 'report-sales-voucher' ,  component : ReportSalesVoucherComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
