import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { PetUpgrade, PermanentPetUpgrade, ServerEventName } from '../../../shared/interfaces';

@Component({
  selector: 'app-petcurrent',
  templateUrl: './petcurrent.page.html',
  styleUrls: ['./petcurrent.page.scss'],
})
export class PetcurrentPage implements OnInit {

  public properUpgradeNames: { [key in PetUpgrade]: string } = {
    maxLevel: 'Max Level',
    goldStorage: 'Gold Storage',
    battleJoinPercent: 'Battle Join Percent',
    gatherTime: 'Gather Time',
    itemFindQualityBoost: 'Item Find Quality Boost',
    itemFindLevelBoost: 'Item Find Level Boost',
    ilpGatherQuantity: 'ILP Gather Quantity'
  };

  public properUpgradeSuffixes: { [key in PetUpgrade]: string } = {
    maxLevel: ' Lv.',
    goldStorage: 'g',
    battleJoinPercent: '%',
    gatherTime: 's',
    itemFindQualityBoost: 'q',
    itemFindLevelBoost: ' Lv.',
    ilpGatherQuantity: ' ILP'
  };

  public properPermanentUpgradeNames: { [key in PermanentPetUpgrade]: string } = {
    inventorySizeBoost: 'Inventory Size',
    soulStashSizeBoost: 'Soul Stash Size',
    adventureLogSizeBoost: 'Adventure Log Size',
    choiceLogSizeBoost: 'Choice Log Size',
    enchantCapBoost: 'Enchant Cap',
    itemStatCapBoost: 'Item stat Cap'
  };

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  upgradeAttr(petUpgrade: PetUpgrade) {
    this.socketService.emit(ServerEventName.PetUpgrade, { petUpgrade });
  }

  oocAction() {
    this.socketService.emit(ServerEventName.PetOOCAction);
  }

}
