import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdjustmentVoucherInfoComponent } from './adjustment-voucher-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'Adjustment-Voucher-info' },
  { path: 'Adjustment-Voucher-info', component: AdjustmentVoucherInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdjustmentVoucherInfoRoutingModule { }
