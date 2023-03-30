import { Component, OnInit } from '@angular/core';
import { BlazeCrashGame } from '../../../../core/blaze/types/blaze-crash-game';
import { BlazeGame } from '../../../../core/blaze/types/blaze-game';
import { BreadcrumbsService } from './../../../../shared/services/breadcrumbs.service';
import { BlazeDoubleGame } from './../../../../core/blaze/types/blaze-double-game';
import { BlazeCrashGeneratorService } from '../../services/blaze-crash-generator/blaze-crash-generator.service';
import { BlazeDoubleGeneratorService } from '../../services/blaze-double-generator/blaze-double-generator.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.sass'],
})
export class CatalogComponent implements OnInit {
  constructor(
    private breadcrumbsService: BreadcrumbsService,
    private blazeCrashGeneratorService: BlazeCrashGeneratorService,
    private blazeDoubleGeneratorService: BlazeDoubleGeneratorService
  ) {}

  selectedGame = BlazeGame.CRASH;

  crashGames: BlazeCrashGame[];
  doubleGames: BlazeDoubleGame[];

  ngOnInit(): void {
    this.breadcrumbsService.update('Início > Catalogador');

    this.generateCrashGames(
      '37719ba5916ec31806ce6b8c5dd115a076c5c1b6055a217bd8adc6aaafa53f08',
      100,
      '2022-06-02T08:09:21.756Z'
    );

    this.generateDoubleGames(
      '753f3d2456bb6a4b5a9ce4c6954d5aedd047163e543bedd1e43d51e19c45f243',
      100
    );
  }

  getButtonVariant(game: string) {
    return this.selectedGame === game ? 'primary' : 'outline';
  }

  changeGame(game: string) {
    this.selectedGame = game as BlazeGame;
  }

  generateCrashGames(serverSeed: string, amount: number, date: string) {
    this.crashGames = this.blazeCrashGeneratorService.generate(
      serverSeed,
      amount,
      date
    );
  }

  generateDoubleGames(serverSeed: string, amount: number) {
    this.doubleGames = this.blazeDoubleGeneratorService.generate(
      serverSeed,
      amount
    );
  }
}
