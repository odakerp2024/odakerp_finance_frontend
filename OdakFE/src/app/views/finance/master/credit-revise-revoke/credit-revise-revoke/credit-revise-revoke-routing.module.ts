import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditReviseRevokeComponent } from './credit-revise-revoke.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'credit-revoke' },
  { path: 'credit-revoke', component: CreditReviseRevokeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditReviseRevokeRoutingModule { }
