import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { decompress } from 'lzutf8';

import { ICombat, ICombatCharacter } from '../../../shared/interfaces';
import { CombatAction, CombatSimulator } from '../../../shared/combat/combat-simulator';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.page.html',
  styleUrls: ['./combat.page.scss'],
})
export class CombatPage implements OnInit {

  public isLoaded: boolean;

  public combat: ICombat;
  public combatAnte = { xp: 0, gold: 0 };
  public combatMessages: Array<{ message: string, data?: ICombat }> = [];
  public summaryMessages: string[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
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

    this.combatAnte.xp = Object.values(this.combat.ante).reduce((prev, cur) => prev + cur.xp, 0);
    this.combatAnte.gold = Object.values(this.combat.ante).reduce((prev, cur) => prev + cur.gold, 0);

    const simulator = new CombatSimulator(this.combat);
    simulator.events$.subscribe(({ action, data }) => {
      if(action === CombatAction.Message) {
        if(!data.message) return;
        this.combatMessages.push({ message: data.message });
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

  private loadVictoryRewardMessages({ combat, winningParty }) {
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
      if(!char.realName) return;

      const ante = combat.ante[char.combatId];

      if(char.combatPartyId !== winningParty) {
        this.summaryMessages.push(`${char.name} lost ${ante.xp.toLocaleString()} XP and ${ante.gold.toLocaleString()} gold!`);
        this.summaryMessages.push(`${char.name} was injured!`);
      } else {
        this.summaryMessages.push(
          `${char.name} earned ${xpPerChar.toLocaleString()} XP and ${goldPerChar.toLocaleString()} gold!`
        );
      }
    });
  }

}
