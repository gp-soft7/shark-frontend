import { format, isValid } from 'date-fns';

export class BlazeCrashGame {
  id: string;
  serverSeed: string;
  crashPoint: number;
  updatedAt: Date;

  get isGreen() {
    return this.crashPoint >= 2;
  }

  get isRed() {
    return this.crashPoint <= 2;
  }

  get hours() {
    return isValid(this.updatedAt) ? format(this.updatedAt, 'HH:mm') : '00:00';
  }
}
