import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptVouchersViewComponent } from './receipt-vouchers-view/receipt-vouchers-view.component';
import { ReceiptVoucherDetailsComponent } from './receipt-voucher-details/receipt-voucher-details.component';

const routes: Routes = [
  { path: '', pathMatch:'full', redirectTo: 'receipt-view'},
  { path: 'receipt-view', component: ReceiptVouchersViewComponent },
  { path: 'receipt-details', component: ReceiptVoucherDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptVouchersRoutingModule { }
