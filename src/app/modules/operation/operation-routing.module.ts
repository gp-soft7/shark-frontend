import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ControlPanelComponent } from './pages/control-panel/control-panel.component';
import { RiskManagementComponent } from './pages/risk-management/risk-management.component';

const routes: Routes = [
  {
    path: '',
    component: ControlPanelComponent,
  },
  {
    path: 'risk-management',
    component: RiskManagementComponent,
  },
  {
    path: 'catalog',
    component: CatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationRoutingModule {}
