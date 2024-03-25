import { RouterModule, Routes } from '@angular/router';
import { AgingConfigurationViewComponent } from './aging-configuration-view/aging-configuration-view.component';
import { NgModule } from '@angular/core';
import { AgingConfigurationComponent } from './aging-configuration/aging-configuration.component';
const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'aging-list' },
    { path: 'aging-list', component:  AgingConfigurationViewComponent},
    { path: 'aging-details', component:  AgingConfigurationComponent}
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class agingRoutingModule{}