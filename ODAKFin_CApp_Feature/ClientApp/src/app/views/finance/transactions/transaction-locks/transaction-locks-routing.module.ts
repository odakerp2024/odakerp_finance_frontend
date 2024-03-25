import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionLocksViewComponent } from './transaction-locks-view/transaction-locks-view.component';
import { TransactionLocksDetailsComponent } from './transaction-locks-details/transaction-locks-details.component';

const routes: Routes = [
  { path: '', pathMatch:'full', redirectTo: 'transaction-locks-view'},
  { path: 'transaction-locks-view', component: TransactionLocksViewComponent },
  { path: 'transaction-locks-details', component: TransactionLocksDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionLocksRoutingModule { }
