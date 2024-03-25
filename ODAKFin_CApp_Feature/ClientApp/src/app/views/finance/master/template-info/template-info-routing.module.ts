import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateInfoComponent } from './template-info.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'template-info-view' },
  { path: 'template-info-view', component: TemplateInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateInfoRoutingModule { }
