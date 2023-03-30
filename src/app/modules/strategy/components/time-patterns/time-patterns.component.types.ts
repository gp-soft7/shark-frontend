export type TimePattern = {
  date: Date;
  items: Array<{
    target: any;
    time: string;
  }>;
  show?: boolean;
  deadlineExpired?: boolean;
  operateAllRounds: boolean;
};

export type TimePatternList = Array<TimePattern>;

export type TimePatternIndexes = {
  patternIndex: number;
  patternItemIndex: number;
};

export type TimePatternIndex = Omit<TimePatternIndexes, 'patternItemIndex'>;

export type TimePatternItemIndex = Omit<TimePatternIndexes, 'patternIndex'>;
