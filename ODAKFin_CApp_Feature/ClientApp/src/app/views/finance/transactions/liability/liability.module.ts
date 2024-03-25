import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiabilityRoutingModule } from './liability.routing.module';
import { LiabilityDetailsComponent } from './liability-details/liability-details.component';
import { LiabilityComponent } from './liability/liability.component';
import { MatDatepickerModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive.module';



@NgModule({
  declarations: [
    LiabilityDetailsComponent,
    LiabilityComponent
  ],
  imports: [
    CommonModule,
    LiabilityRoutingModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatDatepickerModule,
    DirectiveModule
  ]
})
export class LiabilityModule { }
