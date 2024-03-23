import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficeRoutingModule } from './office-routing.module';
import { OfficeComponent } from './office.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [OfficeComponent],
  imports: [
    CommonModule,
    OfficeRoutingModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class OfficeModule { }
