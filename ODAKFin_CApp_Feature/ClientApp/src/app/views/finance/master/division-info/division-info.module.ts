import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DivisionInfoRoutingModule } from './division-info-routing.module';
import { DivisionInfoComponent } from './division-info.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSelectModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [DivisionInfoComponent],
  imports: [
    CommonModule,
    DivisionInfoRoutingModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatSelectModule,
    NgSelectModule
  ]
})
export class DivisionInfoModule { }
