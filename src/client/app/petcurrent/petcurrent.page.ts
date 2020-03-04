import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { PetUpgrade, PermanentUpgrade, ServerEventName, IPet } from '../../../shared/interfaces';
import { AlertController, PopoverController } from '@ionic/angular';
import { RerollPopover } from './reroll.popover';

@Component({
  selector: 'app-petcurrent',
  templateUrl: './petcurrent.page.html',
  styleUrls: ['./petcurrent.page.scss'],
})
export class PetcurrentPage implements OnInit {

  public properUpgradeNames: { [key in PetUpgrade]: string } = {
    [PetUpgrade.GoldStorage]: 'Gold Storage',
    [PetUpgrade.BattleJoinPercent]: 'Battle Join Percent',
    [PetUpgrade.GatherTime]: 'Gather Time',
    [PetUpgrade.ItemFindQualityBoost]: 'Item Find Quality Boost',
    [PetUpgrade.ItemFindLevelBoost]: 'Item Find Level Boost',
    [PetUpgrade.ItemFindLevelPercent]: 'Item Find % Boost',
    [PetUpgrade.ILPGatherQuantity]: 'ILP Gather Quantity',
    [PetUpgrade.StrongerSoul]: 'Stronger Soul',
    [PetUpgrade.SoulShare]: 'Soul Share %'
  };

  public properUpgradeSuffixes: { [key in PetUpgrade]: string } = {
    [PetUpgrade.GoldStorage]: 'g',
    [PetUpgrade.BattleJoinPercent]: '%',
    [PetUpgrade.GatherTime]: 's',
    [PetUpgrade.ItemFindQualityBoost]: 'q',
    [PetUpgrade.ItemFindLevelBoost]: ' Lv.',
    [PetUpgrade.ItemFindLevelPercent]: '%',
    [PetUpgrade.ILPGatherQuantity]: ' ILP',
    [PetUpgrade.StrongerSoul]: ' Lv.',
    [PetUpgrade.SoulShare]: '%'
  };

  public properPermanentUpgradeNames: { [key in PermanentUpgrade]: string } = {
    [PermanentUpgrade.InventorySizeBoost]: 'Inventory Size',
    [PermanentUpgrade.BuffScrollDuration]: 'Buff Scroll Duration',
    [PermanentUpgrade.AdventureLogSizeBoost]: 'Adventure Log Size',
    [PermanentUpgrade.ChoiceLogSizeBoost]: 'Choice Log Size',
    [PermanentUpgrade.EnchantCapBoost]: 'Enchant Cap',
    [PermanentUpgrade.ItemStatCapBoost]: 'Item Stat Cap',
    [PermanentUpgrade.PetMissionCapBoost]: 'Pet Mission Cap',
    [PermanentUpgrade.MaxPetsInCombat]: 'Pets in Combat',
    [PermanentUpgrade.InjuryThreshold]: 'Injuries Cap',
    [PermanentUpgrade.MaxStaminaBoost]: 'Max Stamina Boost',
    [PermanentUpgrade.MaxQuestsCapBoost]: 'Max Quest Cap',
    [PermanentUpgrade.SalvageBoost]: 'Salvage Boost'
  };

  constructor(
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
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

  async showTrail(trail = [], stat: string, total: number) {
    const baseString = trail.map(({ val, reason }) => {
      return `<tr><td>${val > 0 ? '+' + val : val}</td><td>${reason}</td></tr>`;
    }).join('');

    const resultString = `<tr><td><strong>${total > 0 ? '+' + total : total}</strong></td><td><strong>Total</strong></td>`;

    const finalString = '<table class="stat-trail-table">' + baseString + resultString + '</table>';

    const alert = await this.alertCtrl.create({
      header: `Stat Trail (${stat.toUpperCase()})`,
      message: trail.length > 0 ? finalString : 'No trail to display for this stat.',
      buttons: [
        'OK'
      ]
    });

    alert.present();
  }

  async ascend(pet: IPet) {

    const matString = (pet.$$player.hardcore ? "Nothing!" : Object.keys(pet.$ascMaterials)
      .map(mat => `<li>${mat.split('Crystal').join('')} Crystal (x${pet.$ascMaterials[mat]})</li>`)
      .join(''));

    const alert = await this.alertCtrl.create({
      header: 'Enhance',
      message: `Are you sure you want to enhance your pet?
      It will NOT reset level, and will earn further upgrades.
      It will cost the following materials: <br><ol>${matString}</ol>`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Yes, enhance!', handler: () => {
          this.socketService.emit(ServerEventName.PetAscend);
        } }
      ]
    });

    alert.present();
  }

  takeGold() {
    this.socketService.emit(ServerEventName.PetGoldAction);
  }

  async petActions($event) {
    $event.preventDefault();
    $event.stopPropagation();

    const popover = await this.popoverCtrl.create({
      component: RerollPopover,
      event: $event,
      translucent: true
    });

    return await popover.present();
  }

}
