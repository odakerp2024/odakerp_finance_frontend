import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContraVoucherComponent } from './contra-voucher.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'contra-view' },
  { path: 'contra-view', component: ContraVoucherComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContraVoucherRoutingModule { }
