import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseInfoComponent } from './purchase-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'purchase-info-view' },
  { path: 'purchase-info-view', component: PurchaseInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseInfoRoutingModule { }
