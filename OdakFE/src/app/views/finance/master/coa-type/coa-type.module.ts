import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoaTypeRoutingModule } from './coa-type-routing.module';
import { CoaTypeComponent } from './coa-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [CoaTypeComponent],
  imports: [
    CommonModule,
    CoaTypeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class CoaTypeModule { }
