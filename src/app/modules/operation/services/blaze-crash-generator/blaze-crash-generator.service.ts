import { Injectable } from '@angular/core';
import { BlazeCrashGame } from '../../../../core/blaze/types/blaze-crash-game';
import * as CryptoJS from 'crypto-js';
import { addMilliseconds, parseISO, subMilliseconds } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class BlazeCrashGeneratorService {
  CLIENT_SEED =
    '0000000000000000000415ebb64b0d51ccee0bb55826e43846e5bea777d91966';

  private isDivisible(hash: string, mod: number) {
    let val = 0;

    let o = hash.length % 4;
    for (let i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
      val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
    }

    return val === 0;
  }

  private getPoint(hash: string) {
    if (this.isDivisible(hash, 15)) return 0;

    let h = parseInt(hash.slice(0, 52 / 4), 16);
    let e = Math.pow(2, 52);

    return Math.floor((100 * e - h) / (e - h)) / 100;
  }

  generate(serverSeed: string, amount: number, date: string) {
    const chain = [serverSeed];

    for (let i = 0; i < amount; i++) {
      chain.push(
        CryptoJS.SHA256(chain[chain.length - 1]).toString(CryptoJS.enc.Hex)
      );
    }

    const games = chain.map((serverSeed) => {
      const hash = CryptoJS.HmacSHA256(this.CLIENT_SEED, serverSeed).toString(
        CryptoJS.enc.Hex
      );

      const crashPoint = this.getPoint(hash);

      const game = new BlazeCrashGame();
      game.crashPoint = crashPoint;
      game.serverSeed = serverSeed;
      return game;
    });

    let lastDate = parseISO(date);

    games[0].updatedAt = lastDate;

    for (let i = 1; i < amount; i++) {
      games[i].updatedAt = subMilliseconds(
        lastDate,
        a(games[i].crashPoint) + 10250
      );
      lastDate = games[i].updatedAt;
    }

    return games;
  }
}

const i = 6e-5;

const logBase = (n: number, base: number) => Math.log(n) / Math.log(base);

function a(t: number) {
  if(t === 0) return 0;
  // b = Math.E^ (i * t)
  // Math.E^1/(1 * t)= b

  // console.log(logBase(b, 1 / (i * t)) , b, t);
  return Math.ceil(logBase(t, Math.E) / i);
}
