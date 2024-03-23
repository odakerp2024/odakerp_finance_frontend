import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyMappingComponent } from './party-mapping.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'party-mapping-view' },
  { path: 'party-mapping-view', component: PartyMappingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyMappingRoutingModule { }
