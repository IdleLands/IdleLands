import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { decompress } from 'lzutf8';

import { ICombat, ICombatCharacter, Stat } from '../../../shared/interfaces';
import { CombatAction, CombatSimulator } from '../../../shared/combat/combat-simulator';
import { GameService } from '../game.service';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.page.html',
  styleUrls: ['./combat.page.scss'],
})
export class CombatPage implements OnInit {

  public canShare: boolean;
  public isShare: boolean;
  public isLoaded: boolean;

  public combat: ICombat;
  public combatAnte = { xp: 0, gold: 0, items: [], collectibles: [] };
  public combatMessages: Array<{ message: string, data?: ICombat, highlight?: boolean }> = [];
  public summaryMessages: string[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private gameService: GameService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.isShare = window.location.href.includes('/s/c/');
    this.canShare = 'share' in navigator;
    const combat = this.activatedRoute.snapshot.paramMap.get('combatData');

    try {
      const combatData = JSON.parse(decompress(combat, { inputEncoding: 'Base64' }));
      this.combat = combatData;
    } catch(e) {
      this.router.navigate(['/home']);
      return;
    }

    setTimeout(() => {
      this.beginCombat();
    }, 1000);
  }

  private beginCombat() {

    const myPlayerName = this.gameService.playerRef ? this.gameService.playerRef.name : null;
    const myCombatPlayer = Object.values(this.combat.characters).find(x => x.realName === myPlayerName);
    const myParty = myCombatPlayer ? myCombatPlayer.combatPartyId : null;

    this.combatAnte.xp = Object.values(this.combat.ante).reduce((prev, cur) => prev + cur.xp, 0);
    this.combatAnte.gold = Object.values(this.combat.ante).reduce((prev, cur) => prev + cur.gold, 0);

    this.combatAnte.items = Object.values(this.combat.ante).reduce((prev, cur) => prev.concat(cur.items || []), []);
    this.combatAnte.collectibles = Object.values(this.combat.ante).reduce((prev, cur) => prev.concat(cur.collectibles || []), []);

    const simulator = new CombatSimulator(this.combat);
    simulator.events$.subscribe(({ action, data }) => {
      if(action === CombatAction.Message) {
        if(!data.message) return;
        const combatChar = data.combat.characters[data.source];
        this.combatMessages.push({ message: data.message, highlight: combatChar.combatPartyId === myParty });
      }

      if(action === CombatAction.PrintStatistics) {
        this.combatMessages.push({ message: '__summary', data });
      }

      if(action === CombatAction.SummaryMessage) {
        this.summaryMessages.push(data);
      }

      if(action === CombatAction.Victory) {
        this.isLoaded = true;

        this.loadVictoryRewardMessages(data);
      }
    });

    simulator.beginCombat();
  }

  private loadVictoryRewardMessages({ combat, wasTie, winningParty }) {
    const potSplitTotal = Object.values(combat.characters)
      .filter((x: ICombatCharacter) => x.combatPartyId === winningParty && x.realName)
      .length;

    Object.values(combat.characters)
      .filter((x: ICombatCharacter) => x.combatPartyId === winningParty)
      .forEach((char: ICombatCharacter) => delete combat.ante[char.combatId]);

    const totalXPAnte = Object.values(combat.ante).reduce((prev, cur: any) => prev + cur.xp, 0);
    const totalGoldAnte = Object.values(combat.ante).reduce((prev, cur: any) => prev + cur.gold, 0);

    const xpPerChar = Math.floor(totalXPAnte as number / potSplitTotal);
    const goldPerChar = Math.floor(totalGoldAnte as number / potSplitTotal);

    Object.values(combat.characters).forEach((char: ICombatCharacter) => {
      if(wasTie || !char.realName) return;

      const ante = combat.ante[char.combatId];

      if(char.combatPartyId !== winningParty) {
        this.summaryMessages.push(`${char.name} lost ${ante.xp.toLocaleString()} XP and ${ante.gold.toLocaleString()} gold!`);
        this.summaryMessages.push(`${char.name} was injured!`);
      } else {
        this.summaryMessages.push(`${char.name} earned ${xpPerChar.toLocaleString()} XP and ${goldPerChar.toLocaleString()} gold!`);

        if(this.combatAnte.items.length > 0) {
          this.summaryMessages.push(`${char.name} got a chance to find ${this.combatAnte.items.join(', ')}!`);
        }

        if(this.combatAnte.collectibles.length > 0) {
          this.summaryMessages.push(`${char.name} got a chance to find ${this.combatAnte.collectibles.join(', ')}!`);
        }
      }
    });

    Object.values(combat.characters).forEach((char: ICombatCharacter) => {
      if(wasTie || !char.ownerName || char.combatPartyId !== winningParty) return;

      this.summaryMessages.push(`${char.name} earned ${xpPerChar.toLocaleString()} XP and ${goldPerChar.toLocaleString()} gold!`);
    });
  }

  public getTotalPartyHealth(partyId: number, combat: ICombat): number {
    return Object.values(combat.characters).reduce((prev, cur) => {
      if(cur.combatPartyId !== +partyId) return prev;

      return prev + (cur.stats[Stat.HP] || 0);
    }, 0);
  }

  public async displayPartyCombatMembers(partyId: number, combat: ICombat) {
    const party = combat.parties[partyId];

    const partyRows = Object.values(combat.characters).map(x => {
      if(x.combatPartyId !== +partyId) return '';

      const specialString = x.specialName ? `[${x.specialName} ${(x.stats.special || 0).toLocaleString()}]` : '';

      return `
        <tr>
          <td>
            <strong>${x.name}</strong>
          </td>
          <td>
            [HP ${(x.stats.hp || 0).toLocaleString()}]
          </td>
          <td>
            ${specialString}
          </td>
        </tr>
      `;
    }).join('');

    const finalString = '<table class="party-table">' + partyRows + '</table>';

    const alert = await this.alertCtrl.create({
      header: `${party.name} (Round ${combat.currentRound + 1})`,
      cssClass: 'combat-party-modal',
      message: finalString,
      buttons: [
        'Close'
      ]
    });

    alert.present();
  }

  public share() {
    if(!this.canShare) return;

    (<any>navigator).share({
      title: `IdleLands Combat - ${this.combat.name}`,
      text: 'Check out this sick combat log!',
      url: window.location
    });
  }

}
