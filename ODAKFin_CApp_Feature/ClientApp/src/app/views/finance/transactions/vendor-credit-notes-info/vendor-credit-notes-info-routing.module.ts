import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorCreditNotesInfoComponent } from './vendor-credit-notes-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'vendor-info-view' },
  { path: 'vendor-info-view', component: VendorCreditNotesInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorCreditNotesInfoRoutingModule { }
