import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvisionRoutingModule } from './provision-routing.module';
import { ProvisionViewComponent } from './provision-view/provision-view.component';
import { ProvisionDetailComponent } from './provision-detail/provision-detail.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ProvisionViewComponent,
    ProvisionDetailComponent
  ],
  imports: [
    CommonModule,
    ProvisionRoutingModule,
    NgSelectModule,
    FormsModule, ReactiveFormsModule,
    SharedModule,
  ]
})
export class ProvisionModule { }
