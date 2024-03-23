import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesComponent } from './expenses/expenses.component';
import { ExpensesDetailComponent } from './expenses-detail/expenses-detail.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'expenses' },
  { path:'expenses', component: ExpensesComponent },
  { path:'expenses-detail', component: ExpensesDetailComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ExpensesRoutingModule { }
