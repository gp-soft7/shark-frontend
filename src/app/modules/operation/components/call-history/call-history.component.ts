import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BlazeGame } from '../../../../core/blaze/types/blaze-game';

@Component({
  selector: 'app-call-history',
  templateUrl: './call-history.component.html',
  styleUrls: ['./call-history.component.sass'],
})
export class CallHistoryComponent implements OnInit, OnChanges {
  @Input()
  history: any;

  @Input()
  game: BlazeGame;

  get isCrash() {
    return this.game === BlazeGame.CRASH;
  }

  get isDouble() {
    return this.game === BlazeGame.DOUBLE;
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['game'].firstChange) {
      const currentGame = changes['game'].currentValue;

      if (currentGame === BlazeGame.CRASH) {
        this.adaptCrashHistory(this.history);
      }
    }
  }

  adaptCrashHistory(rawHistory: any) {
    const history: any[] = [];

    for (let i = 0; i < rawHistory.length; i++) {
      const item = rawHistory[i];

      if (typeof item === 'string') {
        history.push(Number(item));
      } else {
        history.push({ ...item, game: Number(item.game) });
      }
    }

    this.history = history;
  }

  isCrashGamePositive(item: any) {
    return typeof item === 'number' ? item > 2 : item.game > 2;
  }

  isCrashGameNegative(item: any) {
    return !this.isCrashGamePositive(item);
  }

  getCrashGameCrashPoint(item: any) {
    return typeof item === 'number' ? `${item.toFixed(2)}X` : `${item.game.toFixed(2)}X`;
  }

  isGameSpecial(item: any) {
    return typeof item !== 'number';
  }

  GAME_ENTRY_TYPE: any = {
    entry: 'Entrada',
    win: 'Vitória',
    loss: 'Derrota',
    separator: '',
  };

  getGameEntryType(item: any) {
    return item.type in this.GAME_ENTRY_TYPE
      ? this.GAME_ENTRY_TYPE[item.type]
      : item.type;
  }

  getGameBets(item: any) {
    return item.bets ? item.bets : [];
  }

  isSeparator(item: any) {
    return typeof item !== 'number' && item.type === 'separator';
  }

  getDoubleGameRoll(item: any) {
    let game = typeof item === 'string' ? item : item.game;

    const isRed = game.indexOf('R') > -1;
    const isBlack = game.indexOf('B') > -1;
    const isWhite = game.indexOf('W') > -1;

    if (isRed) return game.split('R')[0];
    if (isBlack) return game.split('B')[0];
    if (isWhite) return game.split('W')[0];

    return '';
  }

  isDoubleGameColor(item: any, colorChar: string) {
    let game = typeof item === 'string' ? item : item.game;

    return game.indexOf(colorChar) > -1;
  }

  ngOnInit(): void {}
}
