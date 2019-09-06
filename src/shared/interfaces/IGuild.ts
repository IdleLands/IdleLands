
export type GuildRecruitMode = 'Closed' | 'Apply' | 'Open';

export enum GuildResource {
  Astralium = 'astralium',
  Wood = 'wood',
  Clay = 'clay',
  Stone = 'stone',
  Gold = 'gold'
}

export enum GuildMemberTier {
  Member = 1,
  Moderator = 5,
  Leader = 10
}

export enum GuildBuilding {
  Academy = 'academy',
  Tavern = 'tavern',
  GuildHall = 'guildhall',
  Stash = 'guildstash',
  Crier = 'crier',
  Enchantress = 'enchantress',
  FortuneTeller = 'fortuneteller',
  Merchant = 'merchant',
  Mascot = 'mascot',
  FactoryScroll = 'factory:scroll',
  GeneratorWood = 'generator:wood',
  GeneratorStone = 'generator:stone',
  GeneratorClay = 'generator:clay',
  GeneratorAstralium = 'generator:astralium',
  GardenStrength = 'garden:str',
  GardenDexterity = 'garden:dex',
  GardenAgility = 'garden:agi',
  GardenConstitution = 'garden:con',
  GardenIntelligence = 'garden:int',
  GardenLuck = 'garden:luk'
}

export const GuildBuildingCosts: { [key in GuildBuilding]: number } = {
  [GuildBuilding.Academy]: 5,
  [GuildBuilding.Tavern]: 5,
  [GuildBuilding.GuildHall]: 0,
  [GuildBuilding.Stash]: 0,
  [GuildBuilding.Crier]: 1,
  [GuildBuilding.Enchantress]: 10,
  [GuildBuilding.FortuneTeller]: 10,
  [GuildBuilding.Merchant]: 10,
  [GuildBuilding.Mascot]: 1,
  [GuildBuilding.FactoryScroll]: 25,
  [GuildBuilding.GeneratorWood]: 25,
  [GuildBuilding.GeneratorStone]: 25,
  [GuildBuilding.GeneratorClay]: 25,
  [GuildBuilding.GeneratorAstralium]: 25,
  [GuildBuilding.GardenStrength]: 10,
  [GuildBuilding.GardenDexterity]: 1,
  [GuildBuilding.GardenAgility]: 1,
  [GuildBuilding.GardenConstitution]: 1,
  [GuildBuilding.GardenIntelligence]: 10,
  [GuildBuilding.GardenLuck]: 35
};

export const GuildBuildingDescs: { [key in GuildBuilding]: (level: number) => string } = {
  [GuildBuilding.Academy]: (level) => `Your guild can hold ${level * 5} more members.`,
  [GuildBuilding.Tavern]: (level) => `Your members gambling events will do something.`,
  [GuildBuilding.GuildHall]: (level) => `You have ${level} building points to allocate for buildings.`,
  [GuildBuilding.Stash]: (level) => `You can hold ${level * 25000} clay, stone, wood, and astralium.`,
  [GuildBuilding.Crier]: (level) => `You will periodically send messages notifying your guilds recruitment status.`,
  [GuildBuilding.Enchantress]: (level) => `Your members enchanting events will do something.`,
  [GuildBuilding.FortuneTeller]: (level) => `Your members providence events will do something.`,
  [GuildBuilding.Merchant]: (level) => `Your members merchant events will do something.`,
  [GuildBuilding.Mascot]: (level) => `It's just for bragging rights.`,
  [GuildBuilding.FactoryScroll]: (level) => `Your guild will periodically generate buff scrolls for all online members.`,
  [GuildBuilding.GeneratorWood]: (level) => `Your guild will generate ${level * 5} wood per hour.`,
  [GuildBuilding.GeneratorStone]: (level) => `Your guild will generate ${level * 5} stone per hour.`,
  [GuildBuilding.GeneratorClay]: (level) => `Your guild will generate ${level * 5} clay per hour.`,
  [GuildBuilding.GeneratorAstralium]: (level) => `Your guild will generate ${level * 5} astralium per hour.`,
  [GuildBuilding.GardenStrength]: (level) => `Your guild will boost STR ${level * 5} for all online members.`,
  [GuildBuilding.GardenDexterity]: (level) => `Your guild will boost DEX ${level * 5} for all online members.`,
  [GuildBuilding.GardenAgility]: (level) => `Your guild will boost AGI ${level * 5} for all online members.`,
  [GuildBuilding.GardenConstitution]: (level) => `Your guild will boost CON ${level * 5} for all online members.`,
  [GuildBuilding.GardenIntelligence]: (level) => `Your guild will boost INT ${level * 5} for all online members.`,
  [GuildBuilding.GardenLuck]: (level) => `Your guild will boost LUK ${level * 5} for all online members.`
};

export const GuildBuildingUpgradeCosts: { [key in GuildBuilding]: (level: number) => { [res in GuildResource]?: number } } = {
  [GuildBuilding.Academy]:              (level) => (
    { [GuildResource.Gold]: level * 1000000,
      [GuildResource.Clay]: level * 100,
      [GuildResource.Stone]: level * 1000,
      [GuildResource.Wood]: level * 1000 }
  ),
  [GuildBuilding.Tavern]:               (level) => (
    { [GuildResource.Clay]: level * 1000, [GuildResource.Stone]: level * 100, [GuildResource.Wood]: level * 1000 }
  ),
  [GuildBuilding.GuildHall]:            (level) => (
    { [GuildResource.Clay]: level * 1000, [GuildResource.Stone]: level * 1000, [GuildResource.Wood]: level * 100 }
  ),
  [GuildBuilding.Stash]:            (level) => (
    { [GuildResource.Clay]: level * 100,
      [GuildResource.Stone]: level * 100,
      [GuildResource.Wood]: level * 100 }
  ),
  [GuildBuilding.Crier]:                (level) => (
    { [GuildResource.Gold]: level * 100000, [GuildResource.Stone]: level * 1000 }
  ),
  [GuildBuilding.Enchantress]:          (level) => (
    { [GuildResource.Gold]: level * 5000000, [GuildResource.Clay]: level * 1000 }
  ),
  [GuildBuilding.FortuneTeller]:        (level) => (
    { [GuildResource.Gold]: level * 1000000, [GuildResource.Astralium]: level * 1000 }
  ),
  [GuildBuilding.Merchant]:        (level) => (
    { [GuildResource.Gold]: level * 250000, [GuildResource.Wood]: level * 1000 }
  ),
  [GuildBuilding.Mascot]:               (level) => (
    { [GuildResource.Gold]: level * 1000000 }
  ),
  [GuildBuilding.FactoryScroll]:        (level) => (
    { [GuildResource.Gold]: level * 100000, [GuildResource.Astralium]: Math.floor(level * (level ** 1.5)) }
  ),
  [GuildBuilding.GeneratorWood]:        (level) => (
    { [GuildResource.Wood]: Math.floor(level ** 2) }
  ),
  [GuildBuilding.GeneratorStone]:       (level) => (
    { [GuildResource.Stone]: Math.floor(level ** 2) }
  ),
  [GuildBuilding.GeneratorClay]:        (level) => (
    { [GuildResource.Clay]: Math.floor(level ** 2) }
  ),
  [GuildBuilding.GeneratorAstralium]:  (level) => (
    { [GuildResource.Astralium]: Math.floor(level ** 2) }
  ),
  [GuildBuilding.GardenStrength]: (level) => (
    { [GuildResource.Gold]: level * 1000000, [GuildResource.Clay]: level * 500, [GuildResource.Stone]: level * 500 }
  ),
  [GuildBuilding.GardenDexterity]: (level) => (
    { [GuildResource.Gold]: level * 1000000, [GuildResource.Wood]: level * 100 }
  ),
  [GuildBuilding.GardenAgility]: (level) => (
    { [GuildResource.Gold]: level * 1000000, [GuildResource.Clay]: level * 100 }
  ),
  [GuildBuilding.GardenConstitution]: (level) => (
    { [GuildResource.Gold]: level * 1000000, [GuildResource.Stone]: level * 100 }
  ),
  [GuildBuilding.GardenIntelligence]: (level) => (
    { [GuildResource.Gold]: level * 1000000, [GuildResource.Clay]: level * 500, [GuildResource.Wood]: level * 500 }
  ),
  [GuildBuilding.GardenLuck]: (level) => (
    { [GuildResource.Gold]: level * 1000000,
      [GuildResource.Astralium]: level * 500,
      [GuildResource.Clay]: level * 100,
      [GuildResource.Stone]: level * 100,
      [GuildResource.Wood]: level * 100 }
  )
};

export interface IGuild {
  name: string;
  tag: string;
  motd: string;

  buildingPoints: number;

  recruitment: GuildRecruitMode;

  taxes: {
    [GuildResource.Gold]: number
  };

  resources: {
    [GuildResource.Gold]: number,
    [GuildResource.Astralium]: number,
    [GuildResource.Wood]: number,
    [GuildResource.Clay]: number,
    [GuildResource.Stone]: number
  };

  crystals: {
    [key: string]: number
  };

  activeBuildings: {
    [key in GuildBuilding]: boolean
  };

  buildingLevels: {
    [key in GuildBuilding]: number
  };

  members: {
    [key: string]: GuildMemberTier
  };

}
