import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { isToday } from 'date-fns';
import { RecordEntity } from '../../services/record-api/record-api.service.types';
import {
  EVENT_RECORD_LABELS,
  EVENT_RECORD_ICONS,
} from './event-card.component.types';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.sass'],
})
export class EventCardComponent {
  @Input()
  record: RecordEntity;

  datePipe: DatePipe;

  constructor() {
    this.datePipe = new DatePipe('pt-BR');
  }

  getEventRecordTypeLabel(type: string) {
    return EVENT_RECORD_LABELS[type as keyof typeof EVENT_RECORD_LABELS];
  }

  getEventRecordTypeIcon(type: string) {
    return EVENT_RECORD_ICONS[type as keyof typeof EVENT_RECORD_ICONS];
  }

  getEventRecordTypeClass(type: string) {
    return type.toLowerCase();
  }

  getCallDate(createdAt: Date) {
    return isToday(createdAt)
      ? this.datePipe.transform(createdAt, 'shortTime')
      : this.datePipe.transform(createdAt, 'dd/MM HH:mm');
  }
}
