import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesRoutingModule } from './expenses.routing.module';
import { MatDatepickerModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ExpensesComponent } from './expenses/expenses.component';
import { ExpensesDetailComponent } from './expenses-detail/expenses-detail.component';
import { DirectiveModule } from 'src/app/directive/directive.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ExpensesComponent,
    ExpensesDetailComponent
  ],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatDatepickerModule,
    DirectiveModule,
    SharedModule
  ]
})
export class ExpensesModule { }
