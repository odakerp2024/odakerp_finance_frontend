import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContraInfoComponent } from './contra-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'contra-info-view' },
  { path: 'contra-info-view', component: ContraInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContraInfoRoutingModule { }
