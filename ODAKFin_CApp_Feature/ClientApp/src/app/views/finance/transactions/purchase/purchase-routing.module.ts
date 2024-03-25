import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseComponent } from './purchase.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'purchase-view' },
  { path: 'purchase-view', component: PurchaseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
