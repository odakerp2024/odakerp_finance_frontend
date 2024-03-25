import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoucherReversalsInfoRoutingModule } from './voucher-reversals-info-routing.module';
import { VoucherReversalsInfoComponent } from './voucher-reversals-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [VoucherReversalsInfoComponent],
  imports: [
    CommonModule,
    VoucherReversalsInfoRoutingModule,
    ReactiveFormsModule, FormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class VoucherReversalsInfoModule { }
