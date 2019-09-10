import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { GuildBuilding, GuildBuildingNames, GuildBuildingDescs,
  GuildBuildingCosts, GuildBuildingUpgradeCosts } from '../../../shared/interfaces';

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

}
