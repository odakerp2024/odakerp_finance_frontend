import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalInfoRoutingModule } from './internal-info-routing.module';
import { InternalInfoComponent } from './internal-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select'; 
import { DirectiveModule } from 'src/app/directive/directive.module';

@NgModule({
  declarations: [InternalInfoComponent],
  imports: [
    CommonModule,
    InternalInfoRoutingModule,
    FormsModule, ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    DirectiveModule
  ]
})

export class InternalInfoModule { }
