import { BlazeGame } from '../../../../core/blaze/types/blaze-game';

export const OPERATION_STATUS_LABELS = {
  WIN: 'Vitória',
  LOSS: 'Derrota',
  MARTINGALE: 'Martingale',
};

export const OPERATION_STATUS_ICONS = {
  WIN: 'check',
  LOSS: 'close',
  MARTINGALE: 'close',
};

export type CallRecord = {
  id: string;
  game: BlazeGame;
  status: string;
  misc: any;
  result: number;
  createdAt: Date;
  updatedAt: Date;
  strategy: {
    name: string;
  };
};

export type EventRecord = {
  type: 'STOP_GAIN' | 'STOP_LOSS' | 'BOT_START' | 'BOT_STOP' | 'BOT_ERROR';
  misc: any;
};

export type Record = {
  id: string;
  call?: CallRecord;
  event?: EventRecord;
  createdAt: string;
  showMisc?: boolean;
};

export type RecordList = Array<Record>;
