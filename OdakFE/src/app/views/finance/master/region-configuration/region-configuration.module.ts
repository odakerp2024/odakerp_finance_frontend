import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegionConfigurationRoutingModule } from './region-configuration-routing.module';
import { RegionConfigurationViewComponent } from './region-configuration-view/region-configuration-view.component';
import { RegionConfigurationComponent } from './region-configuration/region-configuration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select'; 


@NgModule({
  declarations: [
    RegionConfigurationViewComponent,
    RegionConfigurationComponent
  ],
  imports: [
    CommonModule,
    RegionConfigurationRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgSelectModule
  ]
})
export class RegionConfigurationModule { }
