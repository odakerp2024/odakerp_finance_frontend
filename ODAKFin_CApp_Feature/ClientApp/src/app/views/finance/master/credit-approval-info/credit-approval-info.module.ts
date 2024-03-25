import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditApprovalInfoRoutingModule } from './credit-approval-info-routing.module';
import { CreditApprovalInfoComponent } from './credit-approval-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select'; 
import { DirectiveModule } from 'src/app/directive/directive.module';


@NgModule({
  declarations: [CreditApprovalInfoComponent],
  imports: [
    CommonModule,
    CreditApprovalInfoRoutingModule,
    FormsModule, ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    DirectiveModule
  ]
})
export class CreditApprovalInfoModule { }
