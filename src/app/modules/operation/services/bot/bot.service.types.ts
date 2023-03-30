export type BotRetrieveMessage = {
  status: string;
  startDate: string;
  resetDate: string;
};

export type BotRecordEventMessage = {
  id: string;
  event: {
    type: 'STOP_GAIN' | 'STOP_LOSS' | 'BOT_START' | 'BOT_STOP' | 'BOT_ERROR';
    misc: string;
  };
  createdAt: string;
};
