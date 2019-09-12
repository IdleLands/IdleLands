import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { GuildBuilding, GuildBuildingNames, GuildBuildingDescs,
  GuildBuildingCosts, GuildBuildingUpgradeCosts, ServerEventName } from '../../../shared/interfaces';

@Component({
  selector: 'app-guild-buildings',
  templateUrl: './guild-buildings.page.html',
  styleUrls: ['./guild-buildings.page.scss'],
})
export class GuildBuildingsPage implements OnInit {

  public buildings = Object.values(GuildBuilding);
  public buildingNames = GuildBuildingNames;
  public buildingDescs = GuildBuildingDescs;
  public buildingCosts = GuildBuildingCosts;
  public buildingUpgradeCosts = GuildBuildingUpgradeCosts;

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  toggleBuilding(building: string, newState: boolean) {

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

}
