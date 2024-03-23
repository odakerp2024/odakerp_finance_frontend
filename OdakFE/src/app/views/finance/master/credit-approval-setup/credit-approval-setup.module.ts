import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditApprovalSetupRoutingModule } from './credit-approval-setup-routing.module';
import { CreditApprovalSetupComponent } from './credit-approval-setup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select'; 


@NgModule({
  declarations: [CreditApprovalSetupComponent],
  imports: [
    CommonModule,
    CreditApprovalSetupRoutingModule,
    FormsModule, ReactiveFormsModule ,
    NgSelectModule
  ]
})

export class CreditApprovalSetupModule { }
