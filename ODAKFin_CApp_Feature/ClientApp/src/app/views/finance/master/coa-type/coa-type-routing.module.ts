import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoaTypeComponent } from './coa-type.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cao-type-view' },
  { path: 'cao-type-view', component: CoaTypeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoaTypeRoutingModule { }
