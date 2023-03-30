import { BlazeGame } from '../../../../core/blaze/types/blaze-game';
import { Platform } from '../../../../core/blaze/types/platform';

export type ModalCallDetailsParams = {
  recordId: string;
};

export type CallData = {
  id: string;
  createdAt: Date;
  game: BlazeGame;
  status: string;
  accountType: string;
  misc: any;
  result: number;
  strategyName: string;
  maxDrawdown: number;
  riskReturn: string;
  duration: string;
  platform: Platform;
};
