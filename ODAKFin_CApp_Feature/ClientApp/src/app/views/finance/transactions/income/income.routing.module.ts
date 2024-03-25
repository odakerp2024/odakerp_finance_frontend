import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeComponent } from './income/income.component';
import { IncomeDetailComponent } from './income-detail/income-detail.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'bank' },
  { path: 'income', component: IncomeComponent },
  { path: 'income-detail', component: IncomeDetailComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class IncomeRoutingModule { }
