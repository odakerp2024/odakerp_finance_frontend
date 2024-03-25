import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalOrderComponent } from './internal-order.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'internal-view' },
  { path: 'internal-view', component: InternalOrderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalOrderRoutingModule { } 
