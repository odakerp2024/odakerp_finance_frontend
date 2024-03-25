import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseInvoiseAdminComponent } from './purchase-invoise-admin.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'purchase-invoice-view' },
  { path: 'purchase-invoice-view', component: PurchaseInvoiseAdminComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseInvoiseAdminRoutingModule { }
