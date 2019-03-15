
export enum Stat {
  STR = 'str',
  DEX = 'dex',
  INT = 'int',
  CON = 'con',
  AGI = 'agi',
  LUK = 'luk',

  HP = 'hp',
  SPECIAL = 'special',

  XP = 'xp',
  GOLD = 'gold'
}

export const AllStats = Object.keys(Stat).map(stat => Stat[stat]);
