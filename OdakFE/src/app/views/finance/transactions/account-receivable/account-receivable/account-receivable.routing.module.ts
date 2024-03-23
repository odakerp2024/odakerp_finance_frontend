import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountReceivableComponent } from './account-receivable.component';
import { AccountReceivableDetailsComponent } from '../account-receivable-details/account-receivable-details.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'account-receivable' },
  { path: 'account-receivable', component: AccountReceivableComponent },
  { path: 'account-receivable-detail', component: AccountReceivableDetailsComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AccountReceivableRoutingModule { }
