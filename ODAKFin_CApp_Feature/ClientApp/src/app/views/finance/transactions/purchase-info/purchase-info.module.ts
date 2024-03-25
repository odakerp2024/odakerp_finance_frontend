import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseInfoRoutingModule } from './purchase-info-routing.module';
import { PurchaseInfoComponent } from './purchase-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive.module';


@NgModule({
  declarations: [PurchaseInfoComponent],
  imports: [
    CommonModule,
    PurchaseInfoRoutingModule,
    FormsModule, ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    DirectiveModule
  ]
})
export class PurchaseInfoModule { }
