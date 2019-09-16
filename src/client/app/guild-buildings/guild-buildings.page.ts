import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { GuildBuilding, GuildBuildingNames, GuildBuildingDescs,
   GuildBuildingUpgradeCosts, ServerEventName, GuildBuildingLevelValues } from '../../../shared/interfaces';

@Component({
  selector: 'app-guild-buildings',
  templateUrl: './guild-buildings.page.html',
  styleUrls: ['./guild-buildings.page.scss'],
})
export class GuildBuildingsPage implements OnInit {

  public buildings = [
    { category: 'Basic Buildings', buildings: [
      GuildBuilding.GuildHall, GuildBuilding.Academy, GuildBuilding.Mascot
    ] },
    { category: 'Upkeeps', buildings: [
      GuildBuilding.Crier
    ] },
    { category: 'Friendly Fellows', buildings: [
      GuildBuilding.Enchantress, GuildBuilding.FortuneTeller, GuildBuilding.Merchant,
      GuildBuilding.Tavern, GuildBuilding.WitchDoctor
    ] },
    { category: 'Frantic Factories', buildings: [
      GuildBuilding.FactoryItem, GuildBuilding.FactoryScroll
    ] },
    { category: 'Guilded Generators', buildings: [
      GuildBuilding.GeneratorAstralium, GuildBuilding.GeneratorClay,
      GuildBuilding.GeneratorStone, GuildBuilding.GeneratorWood
    ] },
    { category: 'Groovy Gardens', buildings: [
      GuildBuilding.GardenAgility, GuildBuilding.GardenConstitution, GuildBuilding.GardenDexterity,
      GuildBuilding.GardenIntelligence, GuildBuilding.GardenLuck, GuildBuilding.GardenStrength
    ] },
    { category: 'Curious Causalities', buildings: [
      GuildBuilding.RaidPortal
    ] }
  ];

  public buildingNames = GuildBuildingNames;
  public buildingDescs = GuildBuildingDescs;
  public buildingUpgradeCosts = GuildBuildingUpgradeCosts;

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  toggleBuilding(building: string, newState: boolean) {
    if(!this.gameService.isGuildMod) return;

    const guild = this.gameService.guild;

    if(newState && building.includes(':')) {
      const buildingFirst = building.split(':')[0];
      Object.keys(guild.activeBuildings).forEach(checkBuilding => {
        if(!checkBuilding.startsWith(buildingFirst)) return;

        guild.activeBuildings[checkBuilding] = false;
      });
    }

    setTimeout(() => {
      guild.activeBuildings[building] = newState;
    }, 0);

    this.socketService.emit(ServerEventName.GuildToggleBuilding, { building });
  }

  public iconForBuilding(building: string): string {
    if(!building.includes(':')) return 'square';
    return this.gameService.guild.activeBuildings[building] ? 'checkbox' : 'square-outline';
  }

  public canUpgrade(building: string): boolean {
    if(!this.gameService.isGuildMod) return false;

    const guild = this.gameService.guild;
    const level = (guild.buildingLevels[building] || 0) + 1;
    if(GuildBuildingLevelValues[GuildBuilding.GuildHall](level) < level) return false;

    const costs = GuildBuildingUpgradeCosts[building](level);

    return Object.keys(costs).every(costKey => (guild.resources[costKey] || guild.crystals[costKey]) >= costs[costKey]);
  }

  upgrade(building: string): void {
    if(!this.gameService.isGuildMod) return;

    const guild = this.gameService.guild;
    const level = (guild.buildingLevels[building] || 0) + 1;
    guild.buildingLevels[building] = level;

    const costs = GuildBuildingUpgradeCosts[building](level);
    Object.keys(costs).forEach(costKey => {
      if(costKey.includes('Crystal')) {
        guild.crystals[costKey] -= costs[costKey];
      } else {
        guild.resources[costKey] -= costs[costKey];
      }
    });

    this.socketService.emit(ServerEventName.GuildUpgradeBuilding, { building });
  }

}
