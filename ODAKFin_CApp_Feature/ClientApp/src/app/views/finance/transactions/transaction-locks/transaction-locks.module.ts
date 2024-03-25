import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionLocksRoutingModule } from './transaction-locks-routing.module';
import { TransactionLocksViewComponent } from './transaction-locks-view/transaction-locks-view.component';
import { TransactionLocksDetailsComponent } from './transaction-locks-details/transaction-locks-details.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    TransactionLocksViewComponent,
    TransactionLocksDetailsComponent
  ],
  imports: [
    CommonModule,
    TransactionLocksRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    SharedModule,
    NgSelectModule
  ]
})
export class TransactionLocksModule { }
