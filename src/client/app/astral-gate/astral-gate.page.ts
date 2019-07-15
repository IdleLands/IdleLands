import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';

import * as Gachas from '../../../shared/astralgate';
import { IGacha, GachaNameReward } from '../../../shared/interfaces';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-astral-gate',
  templateUrl: './astral-gate.page.html',
  styleUrls: ['./astral-gate.page.scss'],
})
export class AstralGatePage implements OnInit {

  public gachas: IGacha[] = [];

  constructor(
    private alertCtrl: AlertController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
    this.gachas.push(...Object.values(Gachas).map(ctor => new ctor()));
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

}
