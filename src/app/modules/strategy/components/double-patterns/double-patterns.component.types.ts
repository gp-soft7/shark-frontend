import { BlazeDoubleColor } from '../../../../core/blaze/types/double-color'

export type DoublePatterns = Array<{
  target: BlazeDoubleColor
  pattern: Array<{
    color: BlazeDoubleColor
    roll?: number
  }>
}>

export type DoublePatternIndexes = {
  patternIndex: number
  patternItemIndex: number
}

export type DoublePatternIndex = Omit<DoublePatternIndexes, 'patternItemIndex'>

export type DoublePatternItemIndex = Omit<DoublePatternIndexes, 'patternIndex'>

export const DOUBLE_COLOR_ABBREVIATIONS = {
  B: BlazeDoubleColor.BLACK,
  R: BlazeDoubleColor.RED,
  W: BlazeDoubleColor.WHITE,
  X: BlazeDoubleColor.RANDOM,
  Y: BlazeDoubleColor.BLACKRED,
  U: BlazeDoubleColor.BLACKWHITE,
  I: BlazeDoubleColor.REDWHITE,
}

export const PATTERN_ITEMS_CHAR_COLOR = {
  red: 'R',
  black: 'B',
  white: 'W',
  random: 'X',
  blackred: 'Y',
  blackwhite: 'U',
  redwhite: 'I',
}
