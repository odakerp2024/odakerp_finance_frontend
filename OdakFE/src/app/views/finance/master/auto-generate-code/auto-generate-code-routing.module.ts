import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoGenerateCodeComponent } from './auto-generate-code.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auto-view' },
  { path: 'auto-view', component: AutoGenerateCodeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AutoGenerateCodeRoutingModule { }
