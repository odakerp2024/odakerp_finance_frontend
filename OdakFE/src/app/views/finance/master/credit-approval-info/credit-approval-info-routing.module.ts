import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditApprovalInfoComponent } from './credit-approval-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'credit-info-view' },
  { path: 'credit-info-view', component: CreditApprovalInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CreditApprovalInfoRoutingModule { }
