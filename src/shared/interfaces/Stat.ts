
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

export const StatPartnerDivisor = {
  [Stat.STR]: 10,
  [Stat.INT]: 10,

  [Stat.DEX]: 10,
  [Stat.AGI]: 10,

  [Stat.CON]: 10,
  [Stat.LUK]: 10,

  [Stat.HP]: 5,

  [Stat.XP]: 100,
  [Stat.GOLD]: 100
};

export const AllStats = Object.keys(Stat).map(stat => Stat[stat]);
export const AllStatsButSpecial = AllStats.filter(x => x !== Stat.SPECIAL && x !== Stat.SALVAGE);
export const AllBaseStats = [Stat.STR, Stat.INT, Stat.CON, Stat.DEX, Stat.AGI, Stat.LUK];
