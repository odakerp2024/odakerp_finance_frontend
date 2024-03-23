import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficeInfoComponent } from './office-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'office-info-view' },
  { path: 'office-info-view', component: OfficeInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfficeInfoRoutingModule { }
