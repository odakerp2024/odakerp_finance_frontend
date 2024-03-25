import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoaNumberRangeComponent } from './coa-number-range.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cao-view' },
  { path: 'cao-view', component: CoaNumberRangeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoaNumberRangeRoutingModule { }
