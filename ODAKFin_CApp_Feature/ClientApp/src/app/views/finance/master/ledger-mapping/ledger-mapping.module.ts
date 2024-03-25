import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LedgerMappingRoutingModule } from './ledger-mapping-routing.module';
import { LedgerMappingComponent } from './ledger-mapping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [LedgerMappingComponent],
  imports: [
    CommonModule,
    LedgerMappingRoutingModule,
    FormsModule, ReactiveFormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class LedgerMappingModule { }
