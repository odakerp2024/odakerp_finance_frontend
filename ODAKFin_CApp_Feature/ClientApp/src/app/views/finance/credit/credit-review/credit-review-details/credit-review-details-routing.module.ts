import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditReviewDetailsComponent } from './credit-review-details.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'credit-review-info-view' },
  { path: 'credit-review-info-view', component: CreditReviewDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditReviewDetailsRoutingModule { }
