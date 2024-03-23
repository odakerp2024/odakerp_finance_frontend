import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesArViewComponent } from './invoices-ar-view/invoices-ar-view.component';
import { InvoicesArDetailsComponent } from './invoices-ar-details/invoices-ar-details.component';

const routes: Routes = [
  {path: '', pathMatch:'full', redirectTo:'invoices_AR_view'},
  {path:'invoices_AR_view', component: InvoicesArViewComponent},
  {path:'invoices_AR_Details', component: InvoicesArDetailsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesARRoutingModule { }
