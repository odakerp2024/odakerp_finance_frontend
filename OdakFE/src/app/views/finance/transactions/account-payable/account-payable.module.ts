import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPayableRoutingModule } from './account-payable.routng.module';
import { AccountPayableComponent } from './account-payable/account-payable.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccountPayableDetailsComponent } from './account-payable-details/account-payable-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DirectiveModule } from 'src/app/directive/directive.module';



@NgModule({
  declarations: [
    AccountPayableComponent,
    AccountPayableDetailsComponent
  ],
  imports: [
    CommonModule,
    AccountPayableRoutingModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatDatepickerModule,
    DirectiveModule

  ]
})
export class AccountPayableModule { }
