import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentRequestViewComponent } from './payment-request-view/payment-request-view.component';
import { PaymentRequestDetailsComponent } from './payment-request-details/payment-request-details.component';
import { PaymentBatchComponent } from './payment-batch/payment-batch.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'payment-request-view'},
  { path: 'payment-request-view', component: PaymentRequestViewComponent}, 
  { path: 'payment-request-details', component: PaymentRequestDetailsComponent},
  { path: 'payment-batch', component: PaymentBatchComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRequestRoutingModule { }
