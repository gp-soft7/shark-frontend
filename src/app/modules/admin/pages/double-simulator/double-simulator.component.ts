import { Component, OnInit } from '@angular/core';
import { BreadcrumbsService } from '../../../../shared/services/breadcrumbs.service';
import { BotService } from '../../../operation/services/bot/bot.service';

@Component({
  selector: 'app-double-simulator',
  templateUrl: './double-simulator.component.html',
  styleUrls: ['./double-simulator.component.sass'],
})
export class DoubleSimulatorComponent implements OnInit {
  games: any[] = [];

  constructor(
    private botService: BotService,
    private breadcrumbsService: BreadcrumbsService
  ) {}

  ngOnInit(): void {
    this.breadcrumbsService.update('Início > Administração > Simulador Crash');

    this.botService.tryConnect();
  }

  addGame(color: number, roll: number) {
    this.games.push({ color, roll });

    this.botService.simulateDoubleGame(color, roll);
  }

  randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  addRedGame() {
    this.addGame(1, this.randomNumber(1, 7));
  }

  addBlackGame() {
    this.addGame(2, this.randomNumber(8, 14));
  }

  addWhiteGame() {
    this.addGame(0, 0);
  }
}
