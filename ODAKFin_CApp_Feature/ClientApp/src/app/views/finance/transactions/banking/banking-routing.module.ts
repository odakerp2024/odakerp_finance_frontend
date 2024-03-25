import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankViewComponent } from './bank-view/bank-view.component';

const routes: Routes = [
  { path: '', pathMatch:'full', redirectTo:'bank-view'},
  { path:'bank-view', component: BankViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankingRoutingModule { }
