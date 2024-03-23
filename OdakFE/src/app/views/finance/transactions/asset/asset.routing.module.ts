import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetComponent } from './asset/asset.component';
import { AssetDetailComponent } from './asset-detail/asset-detail.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'asset' },
  { path: 'asset', component: AssetComponent },
  { path: 'asset-detail', component: AssetDetailComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AssetRoutingModule { }
