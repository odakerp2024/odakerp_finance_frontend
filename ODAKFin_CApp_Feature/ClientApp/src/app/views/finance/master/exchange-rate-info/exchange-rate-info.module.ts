import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeRateInfoRoutingModule } from './exchange-rate-info-routing.module';
import { ExchangeRateInfoComponent } from './exchange-rate-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ExchangeRateInfoComponent],
  imports: [
    CommonModule,
    ExchangeRateInfoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgSelectModule
  ]
})
export class ExchangeRateInfoModule { }
