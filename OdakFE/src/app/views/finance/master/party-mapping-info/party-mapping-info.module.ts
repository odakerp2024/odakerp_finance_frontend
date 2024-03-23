import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyMappingInfoRoutingModule } from './party-mapping-info-routing.module';
import { PartyMappingInfoComponent } from './party-mapping-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [PartyMappingInfoComponent],
  imports: [
    CommonModule,
    PartyMappingInfoRoutingModule,
    FormsModule, ReactiveFormsModule,
    NgSelectModule
  ]
})

export class PartyMappingInfoModule { }
