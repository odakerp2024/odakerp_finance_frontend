import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountReceivableComponent } from './account-receivable/account-receivable.component';
import { MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccountReceivableRoutingModule } from './account-receivable/account-receivable.routing.module';
import { AccountReceivableDetailsComponent } from './account-receivable-details/account-receivable-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DirectiveModule } from 'src/app/directive/directive.module';



@NgModule({
  declarations: [
    AccountReceivableComponent,
    AccountReceivableDetailsComponent
  ],
  imports: [
    CommonModule,
    AccountReceivableRoutingModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
   SharedModule,
   MatInputModule,
   DirectiveModule
  ]
})
export class AccountReceivableModule { }
