import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeComponent } from './income/income.component';
import { IncomeDetailComponent } from './income-detail/income-detail.component';
import { IncomeRoutingModule } from './income.routing.module';
import { MatDatepickerModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive.module';



@NgModule({
  declarations: [
    IncomeComponent,
    IncomeDetailComponent
  ],
  imports: [
    CommonModule,
    IncomeRoutingModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatDatepickerModule,
    DirectiveModule
  ]
})
export class IncomeModule { }
