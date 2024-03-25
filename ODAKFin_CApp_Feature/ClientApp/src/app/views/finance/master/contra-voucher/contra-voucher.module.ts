import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContraVoucherRoutingModule } from './contra-voucher-routing.module';
import { ContraVoucherComponent } from './contra-voucher.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ContraVoucherComponent],
  imports: [
    CommonModule,
    ContraVoucherRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class ContraVoucherModule { }
