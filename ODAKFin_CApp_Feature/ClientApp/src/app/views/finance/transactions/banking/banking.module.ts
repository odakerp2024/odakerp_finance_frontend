import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankingRoutingModule } from './banking-routing.module';
import { BankViewComponent } from './bank-view/bank-view.component';
import { BankSummaryComponent } from './bank-view/bank-summary/bank-summary.component';
import { BankBookComponent } from './bank-view/bank-book/bank-book.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BankStatementComponent } from './bank-view/bank-statement/bank-statement.component';
import { BankReconciliationComponent } from './bank-view/bank-reconciliation/bank-reconciliation.component';
import { BankUnReconcileComponent } from './bank-view/bank-un-reconcile/bank-un-reconcile.component';
import { MatIconModule, MatSelectModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    BankViewComponent,
    BankSummaryComponent,
    BankBookComponent,
    BankStatementComponent,
    BankReconciliationComponent,
    BankUnReconcileComponent
  ],
  imports: [
    CommonModule,
    BankingRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule, 
    NgSelectModule
  ]
})
export class BankingModule { }
