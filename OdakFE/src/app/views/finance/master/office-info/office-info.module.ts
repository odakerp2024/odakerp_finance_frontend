import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficeInfoRoutingModule } from './office-info-routing.module';
import { OfficeInfoComponent } from './office-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [OfficeInfoComponent],
  imports: [
    CommonModule,
    OfficeInfoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    SharedModule,
    NgSelectModule
  ]
})
export class OfficeInfoModule { }
