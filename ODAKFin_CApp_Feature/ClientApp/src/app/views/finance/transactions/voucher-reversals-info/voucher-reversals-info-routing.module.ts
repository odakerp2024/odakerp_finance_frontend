import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoucherReversalsInfoComponent } from './voucher-reversals-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'voucher-reversals-info' },
  { path: 'voucher-reversals-info', component: VoucherReversalsInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoucherReversalsInfoRoutingModule { }
