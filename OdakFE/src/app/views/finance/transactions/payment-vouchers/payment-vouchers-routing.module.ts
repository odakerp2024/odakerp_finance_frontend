import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentVoucherViewComponent } from './payment-voucher-view/payment-voucher-view.component';
import { PaymentVoucherDetailsComponent } from './payment-voucher-details/payment-voucher-details.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo:'payment-view'},
  { path: 'payment-view', component: PaymentVoucherViewComponent},
  { path: 'payment-details', component: PaymentVoucherDetailsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentVouchersRoutingModule { }
