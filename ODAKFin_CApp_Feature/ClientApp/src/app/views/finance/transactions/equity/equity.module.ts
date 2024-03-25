import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquityDetailsComponent } from './equity-details/equity-details.component';
import { EquityComponent } from './equity/equity.component';
import { EquityRoutingModule } from './equity.routing.module';
import { MatDatepickerModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive.module';



@NgModule({
  declarations: [
    EquityDetailsComponent,
    EquityComponent
  ],
  imports: [
    CommonModule,
    EquityRoutingModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatDatepickerModule,
    DirectiveModule
  ]
  
})
export class EquityModule { }
