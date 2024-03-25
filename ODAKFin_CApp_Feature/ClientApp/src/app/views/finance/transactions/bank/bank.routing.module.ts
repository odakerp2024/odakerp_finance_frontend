import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankComponent } from './bank/bank.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'bank' },
  { path: 'bank', component: BankComponent },
  { path: 'bank-detail', component: BankDetailsComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BankRoutingModule { }
