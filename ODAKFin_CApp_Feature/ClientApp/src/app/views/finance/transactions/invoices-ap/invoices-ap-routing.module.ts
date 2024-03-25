import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesApViewComponent } from './invoices-ap-view/invoices-ap-view.component';
import { InvoicesApDetailsComponent } from './invoices-ap-details/invoices-ap-details.component';

const routes: Routes = [
  {path: '', pathMatch:'full', redirectTo:'invoices_AP_view'},
  {path:'invoices_AP_view', component: InvoicesApViewComponent},
  {path:'invoices_AP_Details', component: InvoicesApDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesAPRoutingModule { }
