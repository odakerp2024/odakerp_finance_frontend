import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditReviseRevokeInfoeRoutingModule } from './credit-revise-revoke-infoe-routing.module';
import { CreditReviseRevokeInfoComponent } from './credit-revise-revoke-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CreditReviseRevokeInfoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CreditReviseRevokeInfoeRoutingModule,
    SharedModule
  ]
})
export class CreditReviseRevokeInfoeModule { }
