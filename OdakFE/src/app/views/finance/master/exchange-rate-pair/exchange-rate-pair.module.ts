import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeRatePairRoutingModule } from './exchange-rate-pair-routing.module';
import { ExchangeRatePairComponent } from './exchange-rate-pair.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ExchangeRatePairComponent],
  imports: [
    CommonModule,
    ExchangeRatePairRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class ExchangeRatePairModule { }
