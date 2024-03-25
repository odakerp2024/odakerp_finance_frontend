import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeRatePairComponent } from './exchange-rate-pair.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'exchange-ratePair-info' },
  { path: 'exchange-ratePair-info', component: ExchangeRatePairComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRatePairRoutingModule { }
