import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountPayableComponent } from './account-payable/account-payable.component';
import { AccountPayableDetailsComponent } from './account-payable-details/account-payable-details.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'account-payable' },
  { path: 'account-payable', component: AccountPayableComponent },
  { path: 'account-payable-detail', component: AccountPayableDetailsComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AccountPayableRoutingModule { }
