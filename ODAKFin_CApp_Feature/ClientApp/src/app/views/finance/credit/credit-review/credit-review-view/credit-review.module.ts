import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditReviewRoutingModule } from './credit-review-routing.module';
import { CreditReviewComponent } from './credit-review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [CreditReviewComponent],
  imports: [
    CommonModule,
    CreditReviewRoutingModule,
    ReactiveFormsModule, FormsModule, 
    NgSelectModule
  ]
})

export class CreditReviewModule { }
