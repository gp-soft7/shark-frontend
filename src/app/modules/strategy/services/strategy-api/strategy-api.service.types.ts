import { BlazeGame } from '../../../../core/blaze/types/blaze-game';
import { Platform } from '../../../../core/blaze/types/platform';

export type GetUserStrategiesResponse = Array<{
  id: string;
  name: string;
  game: BlazeGame;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  platform: Platform;
}>;

export type GetBriefUserStrategiesResponse = Array<{
  id: string;
  name: string;
  platform: Platform;
}>;

export type GetUserStrategyResponse = {
  id: string;
  name: string;
  game: BlazeGame;
  platform: Platform;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  strategy: string;
};
