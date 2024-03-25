import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRequestRoutingModule } from './payment-request-routing.module';
import { PaymentRequestViewComponent } from './payment-request-view/payment-request-view.component';
import { PaymentRequestDetailsComponent } from './payment-request-details/payment-request-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentBatchComponent } from './payment-batch/payment-batch.component';
import { OpenRequestComponent } from './open-request/open-request.component';
import { PaymentInProgressComponent } from './payment-in-progress/payment-in-progress.component';
import { ClosedPaymentsComponent } from './closed-payments/closed-payments.component';
import { DirectiveModule } from 'src/app/directive/directive.module';


@NgModule({
  declarations: [
    PaymentRequestViewComponent,
    PaymentRequestDetailsComponent,
    PaymentBatchComponent,
    OpenRequestComponent,
    PaymentInProgressComponent,
    ClosedPaymentsComponent
  ],
  imports: [
    CommonModule,
    PaymentRequestRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    SharedModule,
    NgSelectModule,
    MatCheckboxModule,
    DirectiveModule
  ]
})
export class PaymentRequestModule { }
