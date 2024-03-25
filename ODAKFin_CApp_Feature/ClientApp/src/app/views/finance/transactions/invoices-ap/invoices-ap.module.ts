import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesAPRoutingModule } from './invoices-ap-routing.module';
import { InvoicesApViewComponent } from './invoices-ap-view/invoices-ap-view.component';
import { InvoicesApDetailsComponent } from './invoices-ap-details/invoices-ap-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive.module';


@NgModule({
  declarations: [
    InvoicesApViewComponent,
    InvoicesApDetailsComponent
  ],
  imports: [
    CommonModule,
    InvoicesAPRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    DirectiveModule
  ]
})
export class InvoicesAPModule { }
