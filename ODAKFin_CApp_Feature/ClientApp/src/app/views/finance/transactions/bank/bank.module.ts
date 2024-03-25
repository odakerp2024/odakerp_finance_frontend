import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankRoutingModule } from './bank.routing.module';
import { MatDatepickerModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BankComponent } from './bank/bank.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { DirectiveModule } from 'src/app/directive/directive.module';



@NgModule({
  declarations: [
    BankComponent,
    BankDetailsComponent
  ],
  imports: [
    CommonModule,
    BankRoutingModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatDatepickerModule,
    DirectiveModule
  ]
})
export class BankModule { }
