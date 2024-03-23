import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoGenerateCodeRoutingModule } from './auto-generate-code-routing.module';
import { AutoGenerateCodeComponent } from './auto-generate-code.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [AutoGenerateCodeComponent],
  imports: [
    CommonModule,
    AutoGenerateCodeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule

  ]
})
export class AutoGenerateCodeModule { }
