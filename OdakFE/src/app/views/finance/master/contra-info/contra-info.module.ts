import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContraInfoRoutingModule } from './contra-info-routing.module';
import { ContraInfoComponent } from './contra-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ContraInfoComponent],
  imports: [
    CommonModule,
    ContraInfoRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgSelectModule,
    FormsModule
  ]
})
export class ContraInfoModule { }
