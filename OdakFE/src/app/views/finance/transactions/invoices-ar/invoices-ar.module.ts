import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesARRoutingModule } from './invoices-ar-routing.module';
import { InvoicesArViewComponent } from './invoices-ar-view/invoices-ar-view.component';
import { InvoicesArDetailsComponent } from './invoices-ar-details/invoices-ar-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    InvoicesArViewComponent,
    InvoicesArDetailsComponent
  ],
  imports: [
    CommonModule,
    InvoicesARRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class InvoicesARModule { }
