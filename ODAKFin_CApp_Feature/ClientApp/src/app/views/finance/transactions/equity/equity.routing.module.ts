import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquityDetailsComponent } from './equity-details/equity-details.component';
import { EquityComponent } from './equity/equity.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'equity' },
  { path:'equity', component: EquityComponent },
  { path:'equity-detail', component: EquityDetailsComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EquityRoutingModule { }
