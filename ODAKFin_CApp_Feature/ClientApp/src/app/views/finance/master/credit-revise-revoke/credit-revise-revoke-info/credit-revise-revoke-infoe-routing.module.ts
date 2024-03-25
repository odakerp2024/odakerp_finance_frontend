import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditReviseRevokeInfoComponent } from './credit-revise-revoke-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'credit-info-view' },
  { path: 'credit-info-view', component: CreditReviseRevokeInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CreditReviseRevokeInfoeRoutingModule { }
