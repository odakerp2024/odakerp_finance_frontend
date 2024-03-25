import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseInvoiceAdminInfoComponent } from './purchase-invoice-admin-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'purchase-invoice-info' },
  { path: 'purchase-invoice-info', component: PurchaseInvoiceAdminInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseInvoiceAdminInfoRoutingModule { }
