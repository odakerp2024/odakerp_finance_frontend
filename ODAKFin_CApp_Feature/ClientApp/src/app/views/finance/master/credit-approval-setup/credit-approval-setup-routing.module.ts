import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditApprovalSetupComponent } from './credit-approval-setup.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'credit-view' },
  { path: 'credit-view', component: CreditApprovalSetupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditApprovalSetupRoutingModule { }
