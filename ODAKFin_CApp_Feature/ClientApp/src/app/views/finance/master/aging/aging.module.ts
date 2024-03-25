import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgingConfigurationComponent } from './aging-configuration/aging-configuration.component';
import { AgingConfigurationViewComponent } from './aging-configuration-view/aging-configuration-view.component';
import { agingRoutingModule } from './aging-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select'; 
import { DirectiveModule } from 'src/app/directive/directive.module';



@NgModule({
  declarations: [
    AgingConfigurationComponent,
    AgingConfigurationViewComponent,
  ],
  imports: [
    CommonModule,
    agingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    DirectiveModule,

  ]
})
export class AgingModule { }
