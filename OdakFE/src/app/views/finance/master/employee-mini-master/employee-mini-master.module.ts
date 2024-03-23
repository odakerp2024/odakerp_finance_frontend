import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeMiniMasterRoutingModule } from './employee-mini-master-routing.module';
import { EmployeeMiniMasterViewComponent } from './employee-mini-master-view/employee-mini-master-view.component';
import { EmployeeMiniMasterDetailsComponent } from './employee-mini-master-details/employee-mini-master-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    EmployeeMiniMasterViewComponent,
    EmployeeMiniMasterDetailsComponent
  ],
  imports: [
    CommonModule,
    EmployeeMiniMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule

  ]
})
export class EmployeeMiniMasterModule { }
