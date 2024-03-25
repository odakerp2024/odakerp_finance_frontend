import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorCreditNotesComponent } from './vendor-credit-notes.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'vendor-view' },
  { path: 'vendor-view', component: VendorCreditNotesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorCreditNotesRoutingModule { }
