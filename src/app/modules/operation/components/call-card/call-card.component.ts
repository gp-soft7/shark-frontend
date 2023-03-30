import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { isToday } from 'date-fns';
import { ResponsitivyService } from '../../../../shared/services/responsivity.service';
import { RecordEntity } from '../../services/record-api/record-api.service.types';
import { ModalCallDetailsComponent } from '../modal-call-details/modal-call-details.component';
import { CALL_STATUS_ICONS, CALL_STATUS_LABELS, GAME_ICONS } from './call-card.component.types';

@Component({
  selector: 'app-call-card',
  templateUrl: './call-card.component.html',
  styleUrls: ['./call-card.component.sass'],
  animations: [fadeInOnEnterAnimation(), fadeOutOnLeaveAnimation()],
})
export class CallCardComponent implements OnInit {
  @Input()
  record: RecordEntity;

  @Input()
  modalCallDetailsComponent: ModalCallDetailsComponent;

  datePipe: DatePipe;

  constructor(public responsitivy: ResponsitivyService) {
    this.datePipe = new DatePipe('pt-BR');
  }

  ngOnInit(): void {}

  getStrategyGameIcon(game: string) {
    return GAME_ICONS[game as keyof typeof GAME_ICONS];
  }

  viewCallDetails(recordId: string) {
    this.modalCallDetailsComponent.openWithParams({
      recordId,
    });
  }

  getCallDate(createdAt: Date) {
    return isToday(createdAt)
      ? this.datePipe.transform(createdAt, 'shortTime')
      : this.datePipe.transform(createdAt, 'dd/MM HH:mm');
  }

  getCallStatusIcon(status: string) {
    return CALL_STATUS_ICONS[status as keyof typeof CALL_STATUS_ICONS];
  }

  getCallStatusLabel(status: string) {
    return CALL_STATUS_LABELS[status as keyof typeof CALL_STATUS_LABELS];
  }
}
