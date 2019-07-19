import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { ServerEventName, PermanentUpgrade, PremiumScale } from '../../../shared/interfaces';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.page.html',
  styleUrls: ['./premium.page.scss'],
})
export class PremiumPage implements OnInit {

  public scale = PremiumScale;

  public upgrades = [
    { name: 'Adventure Log',   upgrade: PermanentUpgrade.AdventureLogSizeBoost },
    { name: 'Choice Log',      upgrade: PermanentUpgrade.ChoiceLogSizeBoost },
    { name: 'Enchant Cap',     upgrade: PermanentUpgrade.EnchantCapBoost },
    { name: 'Inventory Size',  upgrade: PermanentUpgrade.InventorySizeBoost },
    { name: 'Item Stat Cap',   upgrade: PermanentUpgrade.ItemStatCapBoost },
    { name: 'Buff Duration',   upgrade: PermanentUpgrade.BuffScrollDuration },
  ];

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  public upgradeCost(upgradeName: string, level = 0) {
    return Math.pow(PremiumScale[upgradeName], level + 1);
  }

  buyUpgrade(upgradeName: string) {
    this.socketService.emit(ServerEventName.PremiumUpgrade, { upgradeName });
  }

}
