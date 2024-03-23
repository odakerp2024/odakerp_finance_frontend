import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalOrderRoutingModule } from './internal-order-routing.module';
import { InternalOrderComponent } from './internal-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [InternalOrderComponent],
  imports: [
    CommonModule,
    InternalOrderRoutingModule,
    FormsModule, ReactiveFormsModule,
    SharedModule,
    NgSelectModule
  ]
})
export class InternalOrderModule { }
