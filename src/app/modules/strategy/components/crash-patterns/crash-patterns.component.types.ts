import { BlazeCrashColor } from '../../../../core/blaze/types/crash-color';

type CrashPattern = {
  color?: BlazeCrashColor;
  conditional?: string;
};

export type CrashPatterns = Array<{
  target: number;
  pattern: Array<CrashPattern>;
}>;

export type CrashPatternIndexes = {
  patternIndex: number;
  patternItemIndex: number;
};

export type CrashPatternIndex = Omit<CrashPatternIndexes, 'patternItemIndex'>;

export type CrashPatternItemIndex = Omit<CrashPatternIndexes, 'patternIndex'>;
