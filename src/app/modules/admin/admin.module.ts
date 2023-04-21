import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../../shared/shared.module'
import { AdminRoutingModule } from './admin-routing.module'
import { ManageBotsComponent } from './pages/manage-bots/manage-bots.component'
import { CrashSimulatorComponent } from './pages/crash-simulator/crash-simulator.component'
import { HelpersComponent } from './pages/helpers/helpers.component'
import { DoubleSimulatorComponent } from './pages/double-simulator/double-simulator.component'
import { SubscriptionsComponent } from './pages/subscriptions/subscriptions.component'
import { TokensComponent } from './pages/tokens/tokens.component'

@NgModule({
  declarations: [
    ManageBotsComponent,
    CrashSimulatorComponent,
    HelpersComponent,
    DoubleSimulatorComponent,
    SubscriptionsComponent,
    TokensComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}
