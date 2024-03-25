import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditReviewDetailsRoutingModule } from './credit-review-details-routing.module';
import { CreditReviewDetailsComponent } from './credit-review-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CreditReviewDetailsComponent],
  imports: [
    CommonModule,
    CreditReviewDetailsRoutingModule,
    ReactiveFormsModule, FormsModule
  ]
})
export class CreditReviewDetailsModule { }
