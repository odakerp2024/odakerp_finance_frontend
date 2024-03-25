import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegionConfigurationViewComponent } from './region-configuration-view/region-configuration-view.component';
import { RegionConfigurationComponent } from './region-configuration/region-configuration.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'region-view' },
  { path: 'region-view', component: RegionConfigurationViewComponent},
  { path: 'region-configuration', component: RegionConfigurationComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionConfigurationRoutingModule { }
