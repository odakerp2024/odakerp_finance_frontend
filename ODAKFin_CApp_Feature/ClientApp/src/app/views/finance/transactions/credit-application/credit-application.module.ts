import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditApplicationRoutingModule } from './credit-application-routing.module';
import { CreditApplicationViewComponent } from './credit-application-view/credit-application-view.component';
import { CreditApplicationDetailsComponent } from './credit-application-details/credit-application-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    CreditApplicationViewComponent,
    CreditApplicationDetailsComponent
  ],
  imports: [
    CommonModule,
    CreditApplicationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class CreditApplicationModule { }
