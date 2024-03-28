import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvisionRoutingModule } from './provision-routing.module';
import { ProvisionViewComponent } from './provision-view/provision-view.component';
import { ProvisionDetailComponent } from './provision-detail/provision-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive.module';
import { BrowserModule } from '@angular/platform-browser'

@NgModule({
  declarations: [
    ProvisionViewComponent,
    ProvisionDetailComponent
  ],
  imports: [
    CommonModule,
    ProvisionRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    SharedModule,
    NgSelectModule,
    DirectiveModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' })
  ]
})
export class ProvisionModule { }
