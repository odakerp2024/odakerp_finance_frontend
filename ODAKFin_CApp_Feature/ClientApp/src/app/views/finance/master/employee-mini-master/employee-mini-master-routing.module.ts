import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeMiniMasterViewComponent } from './employee-mini-master-view/employee-mini-master-view.component';
import { EmployeeMiniMasterDetailsComponent } from './employee-mini-master-details/employee-mini-master-details.component';

const routes: Routes = [
  { path: '', pathMatch:'full', redirectTo: 'mini-master-view' },
  { path:'mini-master-view', component: EmployeeMiniMasterViewComponent },
  { path:'mini-master-details', component: EmployeeMiniMasterDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeMiniMasterRoutingModule { }
