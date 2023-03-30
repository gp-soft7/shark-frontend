import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateStrategyComponent } from './pages/create-strategy/create-strategy.component';
import { MyStrategiesComponent } from './pages/my-strategies/my-strategies.component';

const routes: Routes = [
  {
    path: '',
    component: MyStrategiesComponent,
  },

  {
    path: 'create',
    component: CreateStrategyComponent,
  },

  {
    path: ':strategyId',
    component: CreateStrategyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StrategyRoutingModule {}
