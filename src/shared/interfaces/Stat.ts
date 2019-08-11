
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

export const StatPartners = {
  [Stat.STR]: Stat.INT,
  [Stat.INT]: Stat.STR,

  [Stat.DEX]: Stat.AGI,
  [Stat.AGI]: Stat.DEX,

  [Stat.CON]: Stat.LUK,
  [Stat.LUK]: Stat.CON,

  [Stat.HP]: Stat.HP,

  [Stat.XP]: Stat.GOLD,
  [Stat.GOLD]: Stat.XP
};

export const AllStats = Object.keys(Stat).map(stat => Stat[stat]);
export const AllStatsButSpecial = AllStats.filter(x => x !== Stat.SPECIAL);
