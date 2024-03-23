import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoaTypeInfoRoutingModule } from './coa-type-info-routing.module';
import { CoaTypeInfoComponent } from './coa-type-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [CoaTypeInfoComponent],
  imports: [
    CommonModule,
    CoaTypeInfoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})

export class CoaTypeInfoModule { }
