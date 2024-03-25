import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiabilityDetailsComponent } from './liability-details/liability-details.component';
import { LiabilityComponent } from './liability/liability.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'liability' },
  { path: 'liability', component: LiabilityComponent },
  { path: 'liability-detail', component: LiabilityDetailsComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LiabilityRoutingModule { }
