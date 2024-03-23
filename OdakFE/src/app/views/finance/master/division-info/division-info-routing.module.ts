import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DivisionInfoComponent } from './division-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'division-info-view' },
  { path: 'division-info-view', component: DivisionInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivisionInfoRoutingModule { }
