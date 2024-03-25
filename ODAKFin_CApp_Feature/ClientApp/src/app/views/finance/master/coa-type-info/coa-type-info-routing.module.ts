import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoaTypeInfoComponent } from './coa-type-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cao-type-info-view' },
  { path: 'cao-type-info-view', component: CoaTypeInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CoaTypeInfoRoutingModule { }
