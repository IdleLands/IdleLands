
import { Entity, ObjectIdColumn, Column, Index } from 'typeorm';
import { IGuild, GuildRecruitMode, GuildResource, GuildBuilding, GuildMemberTier, Stat, GuildBuildingLevelValues } from '../../interfaces';

@Entity()
export class Guild implements IGuild {

  @ObjectIdColumn() public _id: string;

  @Index({ unique: true })
  @Column() public name: string;

  @Index({ unique: true })
  @Column() public tag: string;

  @Column() public createdAt: number;
  @Column() public motd: string;
  @Column() public recruitment: GuildRecruitMode;
  @Column() public taxes: { [key in GuildResource]?: number };
  @Column() public resources: { [key in GuildResource]: number };
  @Column() public crystals: { [key: string]: number };
  @Column() public activeBuildings: { [key in GuildBuilding]?: boolean };
  @Column() public buildingLevels: { [key in GuildBuilding]?: number };
  @Column() public members: { [key: string]: GuildMemberTier };
  @Column() public nextTick: number;
  @Column() public nextProcs: { [key in GuildBuilding]?: number };

  public init() {
    if(!this.createdAt) this.createdAt = Date.now();
    if(!this.motd) this.motd = 'Welcome to your guild!';
    if(!this.recruitment) this.recruitment = 'Closed';
    if(!this.taxes) this.taxes = { [GuildResource.Gold]: 0 };
    if(!this.resources) {
      this.resources = {
        [GuildResource.Gold]: 0,
        [GuildResource.Astralium]: 0,
        [GuildResource.Clay]: 0,
        [GuildResource.Stone]: 0,
        [GuildResource.Wood]: 0
      };
    }
    if(!this.crystals) this.crystals = { };
    if(!this.activeBuildings) {
        this.activeBuildings = {
        [GuildBuilding.GuildHall]: true,
        [GuildBuilding.Mascot]: true,
        [GuildBuilding.Academy]: true
      };
    }
    if(!this.buildingLevels) {
      this.buildingLevels = {
        [GuildBuilding.GuildHall]: 1,
        [GuildBuilding.Mascot]: 1,
        [GuildBuilding.Academy]: 1
      };
    }
    if(!this.members) this.members = { };
    if(!this.nextTick) this.nextTick = Date.now() + (60 * 60 * 1000);
    if(!this.nextProcs) this.nextProcs = { };
  }

  public addMember(name: string, tier: GuildMemberTier) {
    this.members[name] = tier;
  }

  public removeMember(name: string) {
    delete this.members[name];
  }

  public isBuildingActive(building: GuildBuilding): boolean {
    if(!building.includes(':')) return true;
    return this.activeBuildings[building];
  }

  public buildingBonus(building: GuildBuilding): number {
    return GuildBuildingLevelValues[building](this.buildingLevels[building]);
  }

  public calculateStats(): { [key in Stat]?: number } {
    const stats = { };

    const buildings = [
      GuildBuilding.GardenAgility, GuildBuilding.GardenConstitution, GuildBuilding.GardenDexterity,
      GuildBuilding.GardenIntelligence, GuildBuilding.GardenLuck, GuildBuilding.GardenStrength
    ];

    buildings.forEach(building => {
      if(!this.isBuildingActive(building)) return;
      const stat = building.split(':')[1];

      stats[stat] = this.buildingBonus(building);
    });

    return stats;
  }

  public loop() {
    if(Date.now() < this.nextTick) return;

    this.nextTick = Date.now() + (60 * 60 * 1000);

    const generators = {
      [GuildBuilding.GeneratorAstralium]: GuildResource.Astralium,
      [GuildBuilding.GeneratorClay]:      GuildResource.Clay,
      [GuildBuilding.GeneratorStone]:     GuildResource.Stone,
      [GuildBuilding.GeneratorWood]:      GuildResource.Wood
    };

    const factories = {
      [GuildBuilding.FactoryItem]: () => { },
      [GuildBuilding.FactoryScroll]: () => { },
    };

    Object.keys(generators).forEach((building: GuildBuilding) => {
      if(!this.isBuildingActive(building)) return;

      this.resources[generators[building]] += this.buildingBonus(building);
    });

    Object.keys(factories).forEach((factory: GuildBuilding) => {
      if(!this.isBuildingActive(factory)) return;

      // TODO: do factory callbacks, emit to subscription manager and try to give items to everyone
    });
  }
}
