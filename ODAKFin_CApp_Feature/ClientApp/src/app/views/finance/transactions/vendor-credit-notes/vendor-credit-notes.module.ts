import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorCreditNotesRoutingModule } from './vendor-credit-notes-routing.module';
import { VendorCreditNotesComponent } from './vendor-credit-notes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [VendorCreditNotesComponent],
  imports: [
    CommonModule,
    VendorCreditNotesRoutingModule,
    ReactiveFormsModule, FormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class VendorCreditNotesModule { }
