import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CrashSimulatorComponent } from './pages/crash-simulator/crash-simulator.component'
import { DoubleSimulatorComponent } from './pages/double-simulator/double-simulator.component'
import { HelpersComponent } from './pages/helpers/helpers.component'
import { ManageBotsComponent } from './pages/manage-bots/manage-bots.component'
import { SubscriptionsComponent } from './pages/subscriptions/subscriptions.component'
import { TokensComponent } from './pages/tokens/tokens.component'

const routes: Routes = [
  // {
  //   path: 'manage-bots',
  //   component: ManageBotsComponent,
  // },
  {
    path: 'crash-simulator',
    component: CrashSimulatorComponent,
  },
  {
    path: 'double-simulator',
    component: DoubleSimulatorComponent,
  },
  {
    path: 'helpers',
    component: HelpersComponent,
  },
  {
    path: 'subscriptions',
    component: SubscriptionsComponent,
  },
  {
    path: 'tokens',
    component: TokensComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
