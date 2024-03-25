import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditReviewComponent } from './credit-review.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'credit-review-view' },
  { path: 'credit-review-view', component: CreditReviewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditReviewRoutingModule { }
