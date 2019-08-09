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
    { name: 'Adventure Log',     upgrade: PermanentUpgrade.AdventureLogSizeBoost, desc: 'Your adventure log size goes up by 1.' },
    { name: 'Choice Log',        upgrade: PermanentUpgrade.ChoiceLogSizeBoost, desc: 'Your choice log size goes up by 1.' },
    { name: 'Enchant Cap',       upgrade: PermanentUpgrade.EnchantCapBoost, desc: 'Your enchant cap goes up by 1.' },
    { name: 'Inventory Size',    upgrade: PermanentUpgrade.InventorySizeBoost, desc: 'Your inventory size goes up by 1.' },
    { name: 'Item Stat Cap',     upgrade: PermanentUpgrade.ItemStatCapBoost, desc: 'Your max item boost % goes up by 10%.' },
    { name: 'Buff Duration',     upgrade: PermanentUpgrade.BuffScrollDuration, desc: 'Your buff scroll duration goes up by 1 hour.' },
    { name: 'Pet Mission Cap',   upgrade: PermanentUpgrade.PetMissionCapBoost, desc: 'The number of pet missions you have goes up by 1.' },
    { name: 'Max Stamina Boost', upgrade: PermanentUpgrade.MaxStaminaBoost, desc: 'Your max stamina increases by 5.' },
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
