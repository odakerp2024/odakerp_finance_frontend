import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseInvoiseAdminRoutingModule } from './purchase-invoise-admin-routing.module';
import { PurchaseInvoiseAdminComponent } from './purchase-invoise-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [PurchaseInvoiseAdminComponent],
  imports: [
    CommonModule,
    PurchaseInvoiseAdminRoutingModule,
    FormsModule, ReactiveFormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class PurchaseInvoiseAdminModule { }
