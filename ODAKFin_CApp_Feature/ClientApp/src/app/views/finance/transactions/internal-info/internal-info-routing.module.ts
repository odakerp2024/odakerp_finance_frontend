import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalInfoComponent } from './internal-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'internal-info-view' },
  { path: 'internal-info-view', component: InternalInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InternalInfoRoutingModule { }


