import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbsService } from './../../../../shared/services/breadcrumbs.service';
import { BotService } from './../../../operation/services/bot/bot.service';
import { Subscription } from 'rxjs';
import { collapseAnimation, rotateAnimation } from 'angular-animations';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-manage-bots',
  templateUrl: './manage-bots.component.html',
  styleUrls: ['./manage-bots.component.sass'],
  animations: [
    collapseAnimation(),
    rotateAnimation({
      degrees: 180,
    }),
  ],
})
export class ManageBotsComponent implements OnInit, OnDestroy {
  constructor(
    private breadcrumbsService: BreadcrumbsService,
    private botService: BotService,
    private currencyPipe: CurrencyPipe
  ) {}

  onBotsRetrieved$: Subscription;
  onBotCreated$: Subscription;
  onBotUpdated$: Subscription;
  onBotRemoved$: Subscription;

  bots: any[] = [];

  ngOnInit(): void {
    this.breadcrumbsService.update('Início > Administração > Robôs');

    this.botService.retrieveBots();
    this.subscribeToEvents();
  }

  ngOnDestroy(): void {
    this.unsubscribeToEvents();
  }

  subscribeToEvents() {
    this.onBotsRetrieved$ = this.botService.onBotsRetrieved$.subscribe({
      next: this.onBotsRetrieved.bind(this),
    });
  }

  unsubscribeToEvents() {
    this.onBotsRetrieved$.unsubscribe();
    this.onBotCreated$.unsubscribe();
    this.onBotUpdated$.unsubscribe();
    this.onBotRemoved$.unsubscribe();
  }

  onBotsRetrieved(data: any) {
    if (!data) return;

    this.bots = data.map((item: any) => ({
      ...item,
      hide: true,
    }));
  }

  getBetHistory(betHistory: number[]) {
    return betHistory
      .map((bet) => this.currencyPipe.transform(bet, 'BRL'))
      .join(' | ');
  }
}
