import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateStrategyComponent } from './pages/create-strategy/create-strategy.component';
import { DoublePatternsComponent } from './components/double-patterns/double-patterns.component';
import { RiskManagementComponent } from './components/risk-management/risk-management.component';
import { SharedModule } from '../../shared/shared.module';
import { ConfigDropdownComponent } from './components/config-dropdown/config-dropdown.component';
import { RouterModule } from '@angular/router';
import { LeverageComponent } from './components/leverage/leverage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalChangeStrategyNameComponent } from './components/modal-change-strategy-name/modal-change-strategy-name.component';
import { MyStrategiesComponent } from './pages/my-strategies/my-strategies.component';
import { HttpClientModule } from '@angular/common/http';
import { StrategyRoutingModule } from './strategy-routing.module';
import { CrashPatternsComponent } from './components/crash-patterns/crash-patterns.component';
import { AutoSizeInputModule } from 'ngx-autosize-input';
import { SimulationComponent } from './components/simulation/simulation.component';
import { TimePatternsComponent } from './components/time-patterns/time-patterns.component';
import { NgxMaskModule } from 'ngx-mask';
import { ModalStartTriggersComponent } from './components/modal-start-triggers/modal-start-triggers.component';
import { StartTriggersComponent } from './components/start-triggers/start-triggers.component';
import { ModalTriggerBaseComponent } from './components/modal-trigger-base/modal-trigger-base.component';
import { MartingaleMultipliersComponent } from './components/martingale-multipliers/martingale-multipliers.component';
import { ToggleComponent } from './components/toggle/toggle.component';

@NgModule({
  declarations: [
    CreateStrategyComponent,
    DoublePatternsComponent,
    RiskManagementComponent,
    ConfigDropdownComponent,
    LeverageComponent,
    ModalChangeStrategyNameComponent,
    MyStrategiesComponent,
    CrashPatternsComponent,
    SimulationComponent,
    TimePatternsComponent,
    ModalStartTriggersComponent,
    StartTriggersComponent,
    ModalTriggerBaseComponent,
    MartingaleMultipliersComponent,
    ToggleComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StrategyRoutingModule,
    AutoSizeInputModule,
    NgxMaskModule.forRoot({
      validation: true,
    }),
  ],
})
export class StrategyModule {}
