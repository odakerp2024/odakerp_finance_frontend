import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyMappingInfoComponent } from './party-mapping-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'party-mapping-info-view' },
  { path: 'party-mapping-info-view', component: PartyMappingInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyMappingInfoRoutingModule { }
