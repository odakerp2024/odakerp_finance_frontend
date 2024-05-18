import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMailTableComponent } from './table/e-mail-table/e-mail-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentsComponent } from './document/documents.component';
import { MAT_DATE_FORMATS, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule, MatTableModule } from '@angular/material';
// import { DynamicTableComponent } from './table/dynamic-table/dynamic-table.component';
import { DynamicDecimalDirective } from './directives/decimal/dynamic-decimal.directive';
import { TextOnlyDirective } from './directives/decimal/text-only.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { DynamicDecimalPipeDirective } from './directives/decimal/dynamic-decimal-pipe.directive';


const components = [EMailTableComponent, DocumentsComponent, DynamicDecimalDirective,TextOnlyDirective, DynamicDecimalPipeDirective];
@NgModule({
  declarations: [
    ...components,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatRadioModule,
    MatTableModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    NgSelectModule,
    
  ],
  exports: [...components, MatDatepickerModule, MatInputModule]
})
export class SharedModule { }
