import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalVoucherRoutingModule } from './journal-voucher-routing.module';
import { JournalVoucherDetailsComponent } from './journal-voucher-details/journal-voucher-details.component';
import { JournalVoucherViewComponent } from './journal-voucher-view/journal-voucher-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    JournalVoucherDetailsComponent,
    JournalVoucherViewComponent
  ],
  imports: [
    CommonModule,
    JournalVoucherRoutingModule,
    ReactiveFormsModule, FormsModule, SharedModule,NgSelectModule

  ]
})
export class JournalVoucherModule { }
