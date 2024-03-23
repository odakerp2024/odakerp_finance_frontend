import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DivisionRoutingModule } from './division-routing.module';
import { DivisionComponent } from './division.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [DivisionComponent],
  imports: [
    CommonModule,
    DivisionRoutingModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})

export class DivisionModule { }
