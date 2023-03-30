import { Component, Input } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { CurrencyPipe } from '@angular/common';
import { ModalViewCallsParams } from './modal-view-calls.component.types';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RecordApiService } from './../../services/record-api/record-api.service';
import { GetRecordsResponse } from '../../services/record-api/record-api.service.types';
import { ModalCallDetailsComponent } from '../modal-call-details/modal-call-details.component';
import { IDatePickerDirectiveConfig } from 'ng2-date-picker';
import { convertBrazilianDateFormatToIso } from '../../../../shared/helpers/functions/date/convert-brazilian-dateformat-to-iso.helper';
import { getCurrentIsoDate } from '../../../../shared/helpers/functions/date/get-current-iso-date.helper';
import { getCurrentBrazilianDateFormattedDate } from './../../../../shared/helpers/functions/date/get-current-brazilian-dateformatted-date.helper';
import { parseISO } from 'date-fns';

@Component({
  selector: 'app-modal-view-calls',
  templateUrl: './modal-view-calls.component.html',
  styleUrls: ['./modal-view-calls.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 300 }),
    fadeOutOnLeaveAnimation({ duration: 300 }),
  ],
})
export class ModalViewCallsComponent extends ModalComponent<ModalViewCallsParams> {
  constructor(
    private currencyPipe: CurrencyPipe,
    private loadingService: LoadingService,
    private recordApiService: RecordApiService
  ) {
    super();
  }

  startDate = getCurrentBrazilianDateFormattedDate();
  endDate = getCurrentBrazilianDateFormattedDate();

  startDateIso = getCurrentIsoDate();
  endDateIso = getCurrentIsoDate();

  @Input()
  modalCallDetailsComponent: ModalCallDetailsComponent;

  dayPickerConfiguration: IDatePickerDirectiveConfig = {
    format: 'DD/MM/YYYY',
  };

  records: GetRecordsResponse;
  pages: number[] = [];
  range = '';

  canUpdate = true;

  override onOpen(): void {
    this.updateAll();
  }

  updateAll() {
    if (!this.canUpdate) return;

    this.canUpdate = false;

    this.updateEntries(1, () => {
      this.updateRange();
      this.calculateFirstPages();

      this.canUpdate = true;
    });
  }

  calculateFirstPages() {
    for (let i = 0; i < Math.min(5, this.records.pageCount); i++) {
      this.pages[i] = i + 1;
    }
  }

  updateEntries(page: number, callback?: () => void) {
    this.recordApiService
      .getRecords(
        page,
        14,
        this.startDateIso,
        this.endDateIso,
        this.params.accountType
      )
      .then((records: any) => {
        this.records = records;

        callback && callback();
      });
  }

  getCallResult(raw: number) {
    return `${raw > 0 ? '+' : '-'} ${this.currencyPipe.transform(
      Math.abs(raw),
      'BRL'
    )}`;
  }

  updatePages(direction: 'forward' | 'backward') {
    const { pageCount, page } = this.records;

    if (direction === 'forward') {
      const pagesLeft = Math.min(2, pageCount - page);

      if (pagesLeft === 0) return;

      const lastPage = this.pages[this.pages.length - 1];

      for (let i = 0; i < pagesLeft; i++) {
        this.pages.splice(0, 1);
        this.pages.push(lastPage + i + 1);
      }
    }

    if (direction === 'backward') {
      const pagesLeft = Math.min(2, page - 1);

      if (pagesLeft === 0) return;

      for (let i = page; i > page - pagesLeft; i--) {
        this.pages.splice(4, 1);
        this.pages.unshift(i - 1);
      }
    }
  }

  updateRange() {
    const { page, count } = this.records;
    const perPage = 14;

    this.range = `Exibindo ${perPage * (page - 1) + 1}-${
      perPage * page
    } de ${count} ${count === 1 ? 'registro' : 'registros'}. Total de ${
      this.records.summary.operationCount
    } operações.`;
  }

  changePage(page: number, index: number) {
    if (this.loadingService.isLoading) return;

    this.toggledCallsMisc = [];

    this.updateEntries(page, () => {
      this.updateRange();

      if (index === 0) {
        this.updatePages('backward');
      }

      if (index === 4) {
        this.updatePages('forward');
      }
    });
  }

  nextPage() {
    if (this.loadingService.isLoading) return;

    const nextPage = this.records.page + 1;
    const index = this.pages.findIndex((p) => p === nextPage);

    this.changePage(nextPage, index);
  }

  previousPage() {
    if (this.loadingService.isLoading) return;

    const previousPage = this.records.page - 1;
    const index = this.pages.findIndex((p) => p === previousPage);

    this.changePage(previousPage, index);
  }

  toggledCallsMisc: boolean[] = [];

  toggleCallMisc(index: number) {
    if (this.toggledCallsMisc[index]) {
      delete this.toggledCallsMisc[index];
    } else {
      this.toggledCallsMisc[index] = true;
    }
  }

  getCallMiscBetHistory(betHistory: number[]) {
    return betHistory
      .map((bet) => this.currencyPipe.transform(bet, 'BRL'))
      .join(' | ');
  }

  onStartDateChange(startDate: string) {
    const isoDate = convertBrazilianDateFormatToIso(startDate);
    if (isoDate === null) return;

    if (parseISO(isoDate) > parseISO(this.endDateIso)) {
      return;
    }

    this.startDateIso = isoDate;

    this.updateAll();
  }

  onEndDateChange(endDate: string) {
    const isoDate = convertBrazilianDateFormatToIso(endDate);
    if (isoDate === null) return;

    if (parseISO(isoDate) < parseISO(this.startDateIso)) {
      return;
    }

    this.endDateIso = isoDate;

    this.updateAll();
  }
}
