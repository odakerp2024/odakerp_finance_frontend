import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditApplicationDetailsComponent } from './credit-application-details/credit-application-details.component';
import { CreditApplicationViewComponent } from './credit-application-view/credit-application-view.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'credit-application-view' },
  { path: 'credit-application-view', component: CreditApplicationViewComponent },
  { path: 'credit-application-details', component:CreditApplicationDetailsComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditApplicationRoutingModule { }
