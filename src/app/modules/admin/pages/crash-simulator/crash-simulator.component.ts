import { Component, OnInit } from '@angular/core';
import { BreadcrumbsService } from '../../../../shared/services/breadcrumbs.service';
import { BotService } from './../../../operation/services/bot/bot.service';

@Component({
  selector: 'app-crash-simulator',
  templateUrl: './crash-simulator.component.html',
  styleUrls: ['./crash-simulator.component.sass'],
})
export class CrashSimulatorComponent implements OnInit {
  gameToAdd = 2;

  games: number[] = [];

  constructor(
    private botService: BotService,
    private breadcrumbsService: BreadcrumbsService
  ) {}

  ngOnInit(): void {
    this.breadcrumbsService.update('Início > Administração > Simulador Crash');

    this.botService.tryConnect();
  }

  addGame(game: number) {
    this.games.push(game);

    this.botService.simulateCrashGame(game);
  }

  randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  addBlackGame() {
    this.addGame(this.randomNumber(100, 199) / 100);
  }

  addGreenGame() {
    this.addGame(this.randomNumber(200, 1000) / 100);
  }
}
