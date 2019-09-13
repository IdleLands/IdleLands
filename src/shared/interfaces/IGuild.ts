
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
  GuildHall = 'guildhall',
  Stash = 'guildstash',
  Mascot = 'mascot',
  Crier = 'upkept:crier',
  Tavern = 'person:tavern',
  Enchantress = 'person:enchantress',
  FortuneTeller = 'person:fortuneteller',
  Merchant = 'person:merchant',
  WitchDoctor = 'person:witchdoctor',
  FactoryScroll = 'factory:scroll',
  FactoryItem = 'factory:item',
  GeneratorWood = 'generator:wood',
  GeneratorStone = 'generator:stone',
  GeneratorClay = 'generator:clay',
  GeneratorAstralium = 'generator:astralium',
  GardenStrength = 'garden:str',
  GardenDexterity = 'garden:dex',
  GardenAgility = 'garden:agi',
  GardenConstitution = 'garden:con',
  GardenIntelligence = 'garden:int',
  GardenLuck = 'garden:luk',
  RaidPortal = 'active:raidportal'
}

export const GuildBuildingNames: { [key in GuildBuilding]: string } = {
  [GuildBuilding.Academy]: 'Academy',
  [GuildBuilding.GuildHall]: 'Guild Hall',
  [GuildBuilding.Stash]: 'Guild Stash',
  [GuildBuilding.Mascot]: 'Mascot',
  [GuildBuilding.Crier]: 'Crier',
  [GuildBuilding.Tavern]: 'Tavern Keep',
  [GuildBuilding.Enchantress]: 'Enchantress',
  [GuildBuilding.FortuneTeller]: 'Fortune Teller',
  [GuildBuilding.Merchant]: 'Merchant',
  [GuildBuilding.WitchDoctor]: 'Witch Doctor',
  [GuildBuilding.FactoryScroll]: 'Scroll Factory',
  [GuildBuilding.FactoryItem]: 'Item Factory',
  [GuildBuilding.GeneratorWood]: 'Wood Generator',
  [GuildBuilding.GeneratorStone]: 'Stone Generator',
  [GuildBuilding.GeneratorClay]: 'Clay Generator',
  [GuildBuilding.GeneratorAstralium]: 'Astralium Generator',
  [GuildBuilding.GardenStrength]: 'Strength Garden',
  [GuildBuilding.GardenDexterity]: 'Dexterity Garden',
  [GuildBuilding.GardenAgility]: 'Agility Garden',
  [GuildBuilding.GardenConstitution]: 'Constitution Garden',
  [GuildBuilding.GardenIntelligence]: 'Intelligence Garden',
  [GuildBuilding.GardenLuck]: 'Luck Garden',
  [GuildBuilding.RaidPortal]: 'Raid Portal'
};

export const GuildBuildingDescs: { [key in GuildBuilding]: (level: number) => string } = {
  [GuildBuilding.Academy]: (level) => `Your guild can hold ${(level + 1) * 5} total members.`,
  [GuildBuilding.GuildHall]: (level) => `Your guild buildings can be a maximum of level ${level}.`,
  [GuildBuilding.Stash]: (level) => `You can hold ${(level * 2500).toLocaleString()} clay, stone, wood, and astralium.`,
  [GuildBuilding.Mascot]: (level) => `It's just for bragging rights.`,
  [GuildBuilding.Crier]: (level) => `You will periodically send messages notifying your guilds recruitment status.`,
  [GuildBuilding.Tavern]: (level) => `Your members gambling events will do something.`,
  [GuildBuilding.Enchantress]: (level) => `Your members enchanting events will do something.`,
  [GuildBuilding.FortuneTeller]: (level) => `Your members providence events will do something.`,
  [GuildBuilding.Merchant]: (level) => `Your members merchant events will do something.`,
  [GuildBuilding.WitchDoctor]: (level) => `Your members witch events will do something.`,
  [GuildBuilding.FactoryScroll]: (level) => `Your guild will periodically generate buff scrolls for all online members.`,
  [GuildBuilding.FactoryItem]: (level) => `Your guild will periodically generate items for all online members.`,
  [GuildBuilding.GeneratorWood]: (level) => `Your guild will generate ${level * 5} wood per hour.`,
  [GuildBuilding.GeneratorStone]: (level) => `Your guild will generate ${level * 5} stone per hour.`,
  [GuildBuilding.GeneratorClay]: (level) => `Your guild will generate ${level * 5} clay per hour.`,
  [GuildBuilding.GeneratorAstralium]: (level) => `Your guild will generate ${level * 5} astralium per hour.`,
  [GuildBuilding.GardenStrength]: (level) => `Your guild will boost STR by ${level * 5} for all online members.`,
  [GuildBuilding.GardenDexterity]: (level) => `Your guild will boost DEX by ${level * 5} for all online members.`,
  [GuildBuilding.GardenAgility]: (level) => `Your guild will boost AGI by ${level * 5} for all online members.`,
  [GuildBuilding.GardenConstitution]: (level) => `Your guild will boost CON by ${level * 5} for all online members.`,
  [GuildBuilding.GardenIntelligence]: (level) => `Your guild will boost INT by ${level * 5} for all online members.`,
  [GuildBuilding.GardenLuck]: (level) => `Your guild will boost LUK by ${level * 5} for all online members.`,
  [GuildBuilding.RaidPortal]: (level) => `Your guild can encounter raid bosses up to level ${level * 25}.`
};

export const GuildBuildingUpgradeCosts: { [key in GuildBuilding]: (level: number) => { [res in GuildResource]?: number } } = {
  [GuildBuilding.Academy]:              (level) => (
    { [GuildResource.Gold]: Math.floor((level ** 2) * 1000000),
      [GuildResource.Clay]: level * 100,
      [GuildResource.Stone]: level * 1000,
      [GuildResource.Wood]: level * 1000 }
  ),
  [GuildBuilding.GuildHall]:            (level) => (
    { [GuildResource.Clay]: level * 1000,
      [GuildResource.Stone]: level * 1000,
      [GuildResource.Wood]: level * 1000,
      [GuildResource.Gold]: level * 100000 }
  ),
  [GuildBuilding.Stash]:            (level) => (
    { [GuildResource.Clay]: level * 100,
      [GuildResource.Stone]: level * 100,
      [GuildResource.Wood]: level * 100 }
  ),
  [GuildBuilding.Mascot]:               (level) => (
    { [GuildResource.Gold]: level * 1000000 }
  ),
  [GuildBuilding.Crier]:                (level) => (
    { [GuildResource.Gold]: level * 100000, [GuildResource.Stone]: level * 1000 }
  ),
  [GuildBuilding.Tavern]:               (level) => (
    { [GuildResource.Gold]: level * 1000000,
      [GuildResource.Stone]: level * 100,
      [GuildResource.Wood]: level * 100,
      [GuildResource.Clay]: level * 100 }
  ),
  [GuildBuilding.Enchantress]:          (level) => (
    { [GuildResource.Gold]: level * 5000000, [GuildResource.Clay]: level * 1000 }
  ),
  [GuildBuilding.FortuneTeller]:        (level) => (
    { [GuildResource.Gold]: level * 1000000, [GuildResource.Astralium]: level * 1000 }
  ),
  [GuildBuilding.Merchant]:             (level) => (
    { [GuildResource.Gold]: level * 250000, [GuildResource.Wood]: level * 1000 }
  ),
  [GuildBuilding.WitchDoctor]:          (level) => (
    { [GuildResource.Gold]: level * 250000, [GuildResource.Stone]: level * 1000 }
  ),
  [GuildBuilding.FactoryScroll]:        (level) => (
    { [GuildResource.Gold]: level * 100000, [GuildResource.Astralium]: Math.floor(level * (level ** 1.5)) }
  ),
  [GuildBuilding.FactoryItem]:          (level) => (
    { [GuildResource.Gold]: level * 100000, [GuildResource.Astralium]: Math.floor(level * (level ** 1.5)) }
  ),
  [GuildBuilding.GeneratorWood]:        (level) => (
    { [GuildResource.Wood]: Math.floor((level + 3) ** 2) }
  ),
  [GuildBuilding.GeneratorStone]:       (level) => (
    { [GuildResource.Stone]: Math.floor((level + 3) ** 2) }
  ),
  [GuildBuilding.GeneratorClay]:        (level) => (
    { [GuildResource.Clay]: Math.floor((level + 3) ** 2) }
  ),
  [GuildBuilding.GeneratorAstralium]:   (level) => (
    { [GuildResource.Astralium]: Math.floor((level + 3) ** 2) }
  ),
  [GuildBuilding.GardenStrength]:       (level) => (
    { [GuildResource.Gold]: level * 1000000, [GuildResource.Clay]: level * 500, [GuildResource.Stone]: level * 500 }
  ),
  [GuildBuilding.GardenDexterity]:      (level) => (
    { [GuildResource.Gold]: level * 1000000, [GuildResource.Wood]: level * 100 }
  ),
  [GuildBuilding.GardenAgility]:        (level) => (
    { [GuildResource.Gold]: level * 1000000, [GuildResource.Clay]: level * 100 }
  ),
  [GuildBuilding.GardenConstitution]:   (level) => (
    { [GuildResource.Gold]: level * 1000000, [GuildResource.Stone]: level * 100 }
  ),
  [GuildBuilding.GardenIntelligence]:   (level) => (
    { [GuildResource.Gold]: level * 1000000, [GuildResource.Clay]: level * 500, [GuildResource.Wood]: level * 500 }
  ),
  [GuildBuilding.GardenLuck]:           (level) => (
    { [GuildResource.Gold]: level * 1000000,
      [GuildResource.Astralium]: level * 500,
      [GuildResource.Clay]: level * 100,
      [GuildResource.Stone]: level * 100,
      [GuildResource.Wood]: level * 100 }
  ),
  [GuildBuilding.RaidPortal]:           (level) => (
    { [GuildResource.Astralium]: level * 1000 }
  )
};

export interface IGuildApplication {
  type: 'invite' | 'application';
  playerName: string;
  guildName: string;
}

export interface IGuild {
  name: string;
  tag: string;
  motd: string;
  createdAt: number;

  recruitment: GuildRecruitMode;

  taxes: { [key in GuildResource]?: number };
  resources: { [key in GuildResource]: number };
  crystals: { [key: string]: number };

  activeBuildings: { [key in GuildBuilding]?: boolean };
  buildingLevels: { [key in GuildBuilding]?: number };

  members: { [key: string]: GuildMemberTier };

}

export enum GuildChannelOperation {

  // used when a guild is added
  Add,

  // used when a guild has a new member join
  AddMember,

  // used when a guild member is removed
  RemoveMember,

  // used when a guild needs to update a particular key and syndicate the change
  Update,

  // used when a guild is disbanded
  Remove
}

export const CalculateGuildLevel = (guild: IGuild) => {
  const totalLevel = Object.values(GuildBuilding).reduce((prev, cur) => {
    return prev + (guild.buildingLevels[cur] || 0);
  }, 0);

  const avgLevel = Math.floor(totalLevel / Object.values(GuildBuilding).length);
  if(avgLevel < 1) return 1;

  return avgLevel;
};
