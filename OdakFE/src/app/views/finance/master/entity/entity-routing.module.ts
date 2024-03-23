import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityComponent } from './entity.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'entity-view' },
  { path: 'entity-view', component: EntityComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EntityRoutingModule { }
