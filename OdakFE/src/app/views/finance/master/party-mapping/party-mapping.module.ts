import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyMappingRoutingModule } from './party-mapping-routing.module';
import { PartyMappingComponent } from './party-mapping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [PartyMappingComponent],
  imports: [
    CommonModule,
    PartyMappingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})

export class PartyMappingModule { }
