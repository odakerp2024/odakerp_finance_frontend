import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProvisionViewComponent } from './provision-view/provision-view.component';
import { ProvisionDetailComponent } from './provision-detail/provision-detail.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'provision-view' },
  { path: 'provision-view', component: ProvisionViewComponent },
  { path: 'provision-detail', component: ProvisionDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvisionRoutingModule { }
