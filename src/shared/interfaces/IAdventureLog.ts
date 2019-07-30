
export enum AdventureLogEventType {
  Achievement = 'achievement',
  Ascend = 'ascend',
  Combat = 'combat',
  Explore = 'explore',
  Gold = 'gold',
  Levelup = 'levelup',
  Item = 'item',
  Meta = 'meta',
  Party = 'party',
  Pet = 'pet',
  Profession = 'profession',
  TownCrier = 'crier',
  XP = 'xp',
  Witch = 'witch'
}

export interface IAdventureLog {
  when: number;
  type: AdventureLogEventType;
  message: string;
  link?: string;
}
