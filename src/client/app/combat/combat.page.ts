import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { decompress } from 'lzutf8';

import { ICombat } from '../../../shared/interfaces';
import { CombatAction, CombatSimulator } from '../../../shared/combat/combat-simulator';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.page.html',
  styleUrls: ['./combat.page.scss'],
})
export class CombatPage implements OnInit {

  public combat: ICombat;
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

    this.beginCombat();
  }

  private beginCombat() {

    const simulator = new CombatSimulator(this.combat);
    simulator.events$.subscribe(({ action, data }) => {
      if(action === CombatAction.Message) {
        this.combatMessages.push({ message: data });
      }

      if(action === CombatAction.PrintStatistics) {
        this.combatMessages.push({ message: '__summary', data });
      }

      if(action === CombatAction.SummaryMessage) {
        this.summaryMessages.push(data);
      }
    });

    simulator.beginCombat();
  }

}
