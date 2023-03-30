import { Component, OnInit } from '@angular/core';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import {
  CallData,
  ModalCallDetailsParams,
} from './modal-call-details.component.types';
import { ShimmerLoaded } from './../../../../shared/misc/shimmer-loaded';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RecordApiService } from './../../services/record-api/record-api.service';
import { GetCallRecordResponse } from '../../services/record-api/record-api.service.types';
import { CallDetailsCache } from '../../services/call-details-cache/call-details-cache.service';
import { formatDuration, intervalToDuration } from 'date-fns';
import ptBRLocale from 'date-fns/locale/pt-BR';

@Component({
  selector: 'app-modal-call-details',
  templateUrl: './modal-call-details.component.html',
  styleUrls: ['./modal-call-details.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class ModalCallDetailsComponent
  extends ModalComponent<ModalCallDetailsParams>
  implements OnInit, ShimmerLoaded
{
  constructor(
    private recordApiService: RecordApiService,
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private callDetailsCache: CallDetailsCache
  ) {
    super();
  }

  call: CallData | null = null;

  ngOnInit(): void {}

  override onOpen(): void {
    this.loadCall();
  }

  loadCall() {
    this.call = null;

    const recordId = this.params.recordId;
    const cachedCall = this.callDetailsCache.getCachedCall(recordId);

    if (cachedCall) {
      this.call = cachedCall;
      return;
    }

    this.recordApiService.getCallRecord(recordId).then((call) => {
      this.transformCall(call);
    });
  }

  transformCall(record: GetCallRecordResponse) {
    const call = record.call;

    this.call = {
      id: record.id,
      createdAt: record.createdAt,
      misc: JSON.parse(call.misc),
      result: Number(call.result),
      strategyName: call.strategy.name,
      game: call.game,
      status: call.status,
      accountType: record.accountType,
      maxDrawdown: 0,
      riskReturn: '',
      duration: '',
      platform: record.call.platform,
    };

    this.calculateCallData();

    this.callDetailsCache.cacheCall(record.id, this.call);
  }

  calculateCallData() {
    if (!this.call) return;

    const reducer = (currentValue: number, accumulator: number) =>
      accumulator + currentValue;

    this.call.maxDrawdown = this.call.misc.betHistory.reduce(reducer, 0);

    if (this.call.misc.whiteProtectionBetHistory) {
      this.call.maxDrawdown += this.call.misc.whiteProtectionBetHistory.reduce(
        reducer,
        0
      );
    }

    const riskReturn = this.call.maxDrawdown / this.call.result;

    let resultedRiskReturn = '';

    if (riskReturn < 1) {
      const adjustedRiskReturn = 1 / riskReturn;
      resultedRiskReturn = `${this.decimalPipe.transform(
        adjustedRiskReturn,
        '1.0-2'
      )}:1`;
    } else {
      resultedRiskReturn = `1:${this.decimalPipe.transform(
        riskReturn,
        '1.0-2'
      )}`;
    }

    this.call.riskReturn = resultedRiskReturn;
    this.call.duration = formatDuration(
      intervalToDuration({
        start: new Date(this.call.misc.startDate),
        end: new Date(this.call.createdAt),
      }),
      {
        locale: ptBRLocale,
      }
    );
  }

  getCallMiscBetHistory(betHistory: number[]) {
    return betHistory
      .map((bet) => this.currencyPipe.transform(bet, 'BRL'))
      .join(' | ');
  }

  canShowShimmer(): boolean {
    return this.call === null;
  }

  isLoaded(): boolean {
    return this.call !== null;
  }
}
