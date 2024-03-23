import { NgModule } from '@angular/core';
import { RemoveSpecialCharsDirective } from './RemoveSpecialChars.directive';



@NgModule({
  declarations: [RemoveSpecialCharsDirective],
  imports: [
    // CommonModule
  ],
  exports: [RemoveSpecialCharsDirective]
})
export class DirectiveModule { }
