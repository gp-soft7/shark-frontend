import { Injectable } from '@angular/core';
import { BlazeDoubleGame } from '../../../../core/blaze/types/blaze-double-game';
import { BlazeDoubleColor } from '../../../../core/blaze/types/double-color';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class BlazeDoubleGeneratorService {
  private CLIENT_SEED =
    '0000000000000000002aeb06364afc13b3c4d52767e8c91db8cdb39d8f71e8dd';

  private TILES = [
    { number: 0, color: 0 },
    { number: 11, color: 2 },
    { number: 5, color: 1 },
    { number: 10, color: 2 },
    { number: 6, color: 1 },
    { number: 9, color: 2 },
    { number: 7, color: 1 },
    { number: 8, color: 2 },
    { number: 1, color: 1 },
    { number: 14, color: 2 },
    { number: 2, color: 1 },
    { number: 13, color: 2 },
    { number: 3, color: 1 },
    { number: 12, color: 2 },
    { number: 4, color: 1 },
  ];

  private getColor(color: number) {
    switch (color) {
      case 1:
        return BlazeDoubleColor.RED;
      case 2:
        return BlazeDoubleColor.BLACK;
      default:
        return BlazeDoubleColor.WHITE;
    }
  }

  generate(serverSeed: string, amount: number) {
    const chain = [serverSeed];

    for (let i = 0; i < amount; i++) {
      chain.push(
        CryptoJS.SHA256(chain[chain.length - 1]).toString(CryptoJS.enc.Hex)
      );
    }

    const games: BlazeDoubleGame[] = [];

    chain.map((seed) => {
      const hash = CryptoJS.HmacSHA256(this.CLIENT_SEED, seed).toString(
        CryptoJS.enc.Hex
      );

      const roll = parseInt(hash, 16) % 15;
      const tile = this.TILES.find((t) => t.number === roll);

      if (!tile) return;

      const game = new BlazeDoubleGame();
      game.color = this.getColor(tile.color);
      game.roll = roll;
      game.serverSeed = seed;

      games.push(game);
    });

    return games;
  }
}
