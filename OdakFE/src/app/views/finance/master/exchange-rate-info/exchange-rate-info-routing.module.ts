import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExchangeRateInfoComponent } from './exchange-rate-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'exchange-ratePair-add' },
  { path: 'exchange-ratePair-add', component: ExchangeRateInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRateInfoRoutingModule { }
