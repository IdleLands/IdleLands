import { Component, OnInit, OnDestroy } from '@angular/core';

import { isObject, map, sortBy } from 'lodash';

import { GameService } from '../game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit, OnDestroy {

  private character$: Subscription;
  private updateCycleTimes = 0;

  public statistics = {};
  public statCats = [
    ['Game', 'Event', 'Profession', 'Character', 'Guild'],
    ['Astral Gate', 'Item', 'Pet', 'Environment', 'Combat', 'BossKill', 'Treasure', 'Quest'],
    ['Map']
  ];

  constructor(public gameService: GameService) { }

  ngOnInit() {
    this.character$ = this.gameService.player$.subscribe(player => {
      if(!player) return;

      if(this.updateCycleTimes > 0) {
        this.updateCycleTimes--;
        return;
      }

      this.updateCycleTimes = 6;

      this.statistics = this.handleStatistics(player.$statisticsData);
    });
  }

  ngOnDestroy() {
    this.character$.unsubscribe();
  }

  private handleStatistics(statistics) {
    const recurse = (obj) => {
      return map(obj, (val, key) => {
        const baseObj: any = { name: key };

        if(isObject(val)) {
          baseObj.children = recurse(val);
        } else {
          baseObj.val = val;
        }

        return baseObj;
      });
    };

    const sortAll = (data) => {
      data.forEach(obj => {
        if(!obj.children) return;

        obj.children = sortAll(obj.children);
      });

      return sortBy(data, 'name');
    };

    return sortAll(recurse(statistics))
      .filter(item => !item.val)
      .reduce((prev, item) => {
        prev[item.name] = item;
        return prev;
      }, {});
  }

}
