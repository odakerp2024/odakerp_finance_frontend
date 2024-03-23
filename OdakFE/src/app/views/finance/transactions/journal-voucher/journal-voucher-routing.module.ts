import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JournalVoucherViewComponent } from './journal-voucher-view/journal-voucher-view.component';
import { JournalVoucherDetailsComponent } from './journal-voucher-details/journal-voucher-details.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'journal-view'},
  { path: 'journal-view', component: JournalVoucherViewComponent},
  { path: 'journal-details', component: JournalVoucherDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalVoucherRoutingModule { }
