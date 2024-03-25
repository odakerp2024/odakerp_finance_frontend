import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoucherReversalsComponent } from './voucher-reversals.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'voucher-reversals' },
  { path: 'voucher-reversals', component: VoucherReversalsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VoucherReversalsRoutingModule { }
