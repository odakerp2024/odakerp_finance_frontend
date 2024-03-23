import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LedgerMappingComponent } from './ledger-mapping.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'Ledger-mapping-view' },
  { path: 'Ledger-mapping-view', component: LedgerMappingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LedgerMappingRoutingModule { }
