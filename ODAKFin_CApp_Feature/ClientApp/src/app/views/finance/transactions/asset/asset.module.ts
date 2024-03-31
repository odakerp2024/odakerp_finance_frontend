import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetRoutingModule } from './asset.routing.module';
import { AssetComponent } from './asset/asset.component';
import { MatDatepickerModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AssetDetailComponent } from './asset-detail/asset-detail.component';
import { DirectiveModule } from 'src/app/directive/directive.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    AssetComponent,
    AssetDetailComponent
  ],
  imports: [
    CommonModule,
    AssetRoutingModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatDatepickerModule,
    DirectiveModule,
    SharedModule

  ]
})
export class AssetModule { }
