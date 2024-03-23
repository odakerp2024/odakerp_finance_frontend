import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficeComponent } from './office.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'office-view' },
  { path: 'office-view', component: OfficeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OfficeRoutingModule { }
