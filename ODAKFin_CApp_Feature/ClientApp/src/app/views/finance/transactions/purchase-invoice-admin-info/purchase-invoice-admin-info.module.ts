import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseInvoiceAdminInfoRoutingModule } from './purchase-invoice-admin-info-routing.module';
import { PurchaseInvoiceAdminInfoComponent } from './purchase-invoice-admin-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [PurchaseInvoiceAdminInfoComponent],
  imports: [
    CommonModule,
    PurchaseInvoiceAdminInfoRoutingModule,
    FormsModule, ReactiveFormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class PurchaseInvoiceAdminInfoModule { }
