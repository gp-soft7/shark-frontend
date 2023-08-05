export enum BlazeDoubleColor {
  RED = 'red',
  BLACK = 'black',
  WHITE = 'white',
  RANDOM = 'random',
  BLACKRED = 'blackred',
  BLACKWHITE = 'blackwhite',
  REDWHITE = 'redwhite',
}

const DOUBLE_TILES = [
  { roll: 0, color: BlazeDoubleColor.WHITE },
  { roll: 11, color: BlazeDoubleColor.BLACK },
  { roll: 5, color: BlazeDoubleColor.RED },
  { roll: 10, color: BlazeDoubleColor.BLACK },
  { roll: 6, color: BlazeDoubleColor.RED },
  { roll: 9, color: BlazeDoubleColor.BLACK },
  { roll: 7, color: BlazeDoubleColor.RED },
  { roll: 8, color: BlazeDoubleColor.BLACK },
  { roll: 1, color: BlazeDoubleColor.RED },
  { roll: 14, color: BlazeDoubleColor.BLACK },
  { roll: 2, color: BlazeDoubleColor.RED },
  { roll: 13, color: BlazeDoubleColor.BLACK },
  { roll: 3, color: BlazeDoubleColor.RED },
  { roll: 12, color: BlazeDoubleColor.BLACK },
  { roll: 4, color: BlazeDoubleColor.RED },
]

export const BlazeRedRolls = DOUBLE_TILES.filter(
  (tile) => tile.color === BlazeDoubleColor.RED
)
  .map((tile) => tile.roll)
  .sort((a, b) => a - b)

export const BlazeBlackRolls = DOUBLE_TILES.filter(
  (tile) => tile.color === BlazeDoubleColor.BLACK
)
  .map((tile) => tile.roll)
  .sort((a, b) => a - b)
