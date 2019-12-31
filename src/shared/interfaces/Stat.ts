
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
  GOLD = 'gold',

  SALVAGE = 'salvage'
}

export const AllStats = Object.keys(Stat).map(stat => Stat[stat]);
export const AllStatsButSpecial = AllStats.filter(x => x !== Stat.SPECIAL && x !== Stat.SALVAGE);
export const AllStatsButSpecialInclSalvage = AllStats.filter(x => x !== Stat.SPECIAL);
export const AllBaseStats = [Stat.STR, Stat.INT, Stat.CON, Stat.DEX, Stat.AGI, Stat.LUK];
