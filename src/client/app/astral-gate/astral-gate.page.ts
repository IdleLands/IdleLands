import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';

import * as Gachas from '../../../shared/astralgate';
import { IGacha, GachaNameReward, ServerEventName, IPlayer } from '../../../shared/interfaces';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-astral-gate',
  templateUrl: './astral-gate.page.html',
  styleUrls: ['./astral-gate.page.scss'],
})
export class AstralGatePage implements OnInit, OnDestroy {

  public gachas: Array<{ key: string, value: IGacha }> = [];
  private rewardsCb: Function;

  constructor(
    private alertCtrl: AlertController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
    this.gachas.push(...Object.keys(Gachas).map(key => ({ key, value: new Gachas[key]() })));

    this.rewardsCb = ({ rewards }) => this.gameService.showRewards('Astral Gate Rewards', rewards);
    this.socketService.register(ServerEventName.AstralGateRewards, this.rewardsCb);
  }

  ngOnDestroy() {
    this.socketService.unregister(ServerEventName.AstralGateRewards, this.rewardsCb);
  }

  canRollGachaFree(player: IPlayer, gacha: IGacha) {
    return gacha.freeResetInterval && (player.$premiumData.gachaFreeRolls[gacha.name] || 0) < Date.now();
  }

  async showOdds(gacha: IGacha) {
    const sum = gacha.rewards.reduce((prev, cur) => prev + cur.chance, 0);

    const baseString = gacha.rewards.sort((l, r) => r.chance - l.chance).map(({ result, chance }) => {
      return `<tr>
        <td>${GachaNameReward[result]}</td>
        <td>${chance}/${sum} <span class="move-right">(${(chance / sum * 100).toFixed(5)}%)</span></td>
      </tr>`;
    }).join('');

    const finalString = '<table class="odds-table">' + baseString + '</table>';

    const alert = await this.alertCtrl.create({
      header: `Odds (${gacha.name})`,
      message: finalString,
      buttons: [
        'OK'
      ]
    });

    alert.present();
  }

  public canRoll(player: IPlayer, gacha: IGacha, rolls: number): boolean {
    if(!gacha.requiredToken) return player.$premiumData.ilp >= gacha.rollCost * rolls;

    if(gacha.requiredToken === 'Gold') return player.gold >= gacha.rollCost * rolls;
    return false;
  }

  async roll(gachaName: string, gacha: IGacha, numRolls: number, isFree: boolean) {
    const alert = await this.alertCtrl.create({
      header: `Roll ${gacha.name}`,
      message: `Are you sure you want to roll ${gacha.name} x${numRolls}?
                ${isFree ? '' : `This will cost ${(gacha.rollCost * numRolls).toLocaleString()} ${gacha.requiredToken}.`}`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Yes, roll!', handler: () => {
          this.socketService.emit(ServerEventName.AstralGateRoll, { astralGateName: gachaName, numRolls });
        } }
      ]
    });

    alert.present();
  }

}
