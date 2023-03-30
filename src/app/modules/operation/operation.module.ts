import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { ControlPanelComponent } from './pages/control-panel/control-panel.component';
import { OperationRoutingModule } from './operation-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ModalBlazeConnectionComponent } from './components/modal-blaze-connection/modal-blaze-connection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RiskManagementComponent } from './pages/risk-management/risk-management.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ModalRiskManagementComponent } from './components/modal-risk-management/modal-risk-management.component';
import { ModalViewCallsComponent } from './components/modal-view-calls/modal-view-calls.component';
import { SocketIoModule } from 'ngx-socket-io';
import { CallHistoryComponent } from './components/call-history/call-history.component';
import { ModalCallDetailsComponent } from './components/modal-call-details/modal-call-details.component';
import { CallCardComponent } from './components/call-card/call-card.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { EventCardComponent } from './components/event-card/event-card.component';
import { TimeRestrictionsComponent } from './components/time-restrictions/time-restrictions.component';
import { NgxMaskModule } from 'ngx-mask';
import { ModalSmashVinculationComponent } from './components/modal-smash-vinculation/modal-smash-vinculation.component';

@NgModule({
  declarations: [
    ControlPanelComponent,
    ModalBlazeConnectionComponent,
    RiskManagementComponent,
    CatalogComponent,
    ModalRiskManagementComponent,
    ModalViewCallsComponent,
    CallHistoryComponent,
    ModalCallDetailsComponent,
    CallCardComponent,
    EventCardComponent,
    TimeRestrictionsComponent,
    ModalSmashVinculationComponent,
  ],
  imports: [
    CommonModule,
    OperationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule,
    DpDatePickerModule,
    NgxMaskModule,
  ],
  exports: [ModalRiskManagementComponent],
  providers: [CurrencyPipe, DecimalPipe],
})
export class OperationModule {}
