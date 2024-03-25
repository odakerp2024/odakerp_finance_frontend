import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditReviseRevokeRoutingModule } from './credit-revise-revoke-routing.module';
import { CreditReviseRevokeComponent } from './credit-revise-revoke.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [CreditReviseRevokeComponent],
  imports: [
    CommonModule,
    CreditReviseRevokeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class CreditReviseRevokeModule { }
