import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportReceiptVoucherComponent } from './report-receipt-voucher/report-receipt-voucher.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'report-receipt-voucher' },
  { path: 'report-receipt-voucher', component: ReportReceiptVoucherComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
