import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { PetUpgrade, PermanentUpgrade, ServerEventName, IPet } from '../../../shared/interfaces';
import { AlertController } from '@ionic/angular';

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
    ilpGatherQuantity: 'ILP Gather Quantity',
    strongerSoul: 'Stronger Soul'
  };

  public properUpgradeSuffixes: { [key in PetUpgrade]: string } = {
    maxLevel: ' Lv.',
    goldStorage: 'g',
    battleJoinPercent: '%',
    gatherTime: 's',
    itemFindQualityBoost: 'q',
    itemFindLevelBoost: ' Lv.',
    ilpGatherQuantity: ' ILP',
    strongerSoul: ' Lv.'
  };

  public properPermanentUpgradeNames: { [key in PermanentUpgrade]: string } = {
    inventorySizeBoost: 'Inventory Size',
    soulStashSizeBoost: 'Soul Stash Size',
    adventureLogSizeBoost: 'Adventure Log Size',
    choiceLogSizeBoost: 'Choice Log Size',
    enchantCapBoost: 'Enchant Cap',
    itemStatCapBoost: 'Item stat Cap'
  };

  constructor(
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

    const matString = Object.keys(pet.$ascMaterials)
      .map(mat => `<li>${mat.split('Crystal').join('')} Crystal (x${pet.$ascMaterials[mat]})</li>`)
      .join('');

    const alert = await this.alertCtrl.create({
      header: 'Ascend',
      message: `Are you sure you want to ascend your pet?
      It will NOT reset level, and will earn further upgrades.
      It will cost the following materials: <br><ol>${matString}</ol>`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Yes, ascend!', handler: () => {
          this.socketService.emit(ServerEventName.PetAscend);
        } }
      ]
    });

    alert.present();
  }

}
