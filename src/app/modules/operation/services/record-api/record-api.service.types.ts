import { BlazeGame } from '../../../../core/blaze/types/blaze-game';
import { Platform } from '../../../../core/blaze/types/platform';
import { PaginatedResponse } from '../../../../core/common/paginated-response';

export type RecordEntity = {
  event?: {
    misc: string;
    type: string;
  };
  call?: {
    strategy: {
      name: string;
    };
    game: BlazeGame;
    status: 'WIN' | 'LOSS' | 'ERROR';
    result: number;
    platform: Platform;
  };
  id: string;
  createdAt: Date;
  accountType: 'DEMO' | 'REAL';
};

export type RecordEntityList = Array<RecordEntity>;

export type SummaryEntity = {
  resultBalance: number;
  operationCount: number;
  totalBalance: number;
  score: {
    wins: number;
    losses: number;
  };
};

export type GetRecordsResponse = PaginatedResponse<RecordEntityList> & {
  summary: SummaryEntity;
};

export type GetCallRecordResponse = {
  id: string;
  createdAt: Date;
  accountType: 'DEMO' | 'REAL';
  call: {
    game: BlazeGame;
    status: string;
    misc: any;
    result: number;
    platform: Platform;
    strategy: {
      name: string;
    };
  };
};
