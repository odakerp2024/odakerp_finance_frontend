import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoucherReversalsRoutingModule } from './voucher-reversals-routing.module';
import { VoucherReversalsComponent } from './voucher-reversals.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [VoucherReversalsComponent],
  imports: [
    CommonModule,
    VoucherReversalsRoutingModule,
    ReactiveFormsModule, FormsModule,
    SharedModule,
    NgSelectModule
  ]
})

export class VoucherReversalsModule { }
