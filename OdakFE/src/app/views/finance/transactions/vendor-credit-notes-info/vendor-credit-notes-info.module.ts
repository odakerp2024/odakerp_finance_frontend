import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorCreditNotesInfoRoutingModule } from './vendor-credit-notes-info-routing.module';
import { VendorCreditNotesInfoComponent } from './vendor-credit-notes-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [VendorCreditNotesInfoComponent],
  imports: [
    CommonModule,
    VendorCreditNotesInfoRoutingModule,
    ReactiveFormsModule, FormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class VendorCreditNotesInfoModule { }
