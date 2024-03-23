import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateInfoRoutingModule } from './template-info-routing.module';
import { TemplateInfoComponent } from './template-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select'; 


@NgModule({
  declarations: [TemplateInfoComponent],
  imports: [
    CommonModule,
    TemplateInfoRoutingModule, FormsModule, ReactiveFormsModule,
    NgSelectModule

  ]
})
export class TemplateInfoModule { }
