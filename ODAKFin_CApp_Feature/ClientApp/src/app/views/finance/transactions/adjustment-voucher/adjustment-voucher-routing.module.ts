import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdjustmentVoucherComponent } from './adjustment-voucher.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'Adjustment-Voucher' },
  { path: 'Adjustment-Voucher', component: AdjustmentVoucherComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdjustmentVoucherRoutingModule { }
