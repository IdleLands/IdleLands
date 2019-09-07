import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sortBy, assignInWith } from 'lodash';

import { GameService } from '../game.service';
import { map } from 'rxjs/operators';
import { IFestival } from '../../../shared/interfaces';
import { Festivals } from 'src/shared/models';

@Component({
  selector: 'app-festivals',
  templateUrl: './festivals.page.html',
  styleUrls: ['./festivals.page.scss'],
})
export class FestivalsPage implements OnInit {

  public isLoaded: boolean;
  public festivals: IFestival[] = [];
  public aggregate: any;


  constructor(
    private http: HttpClient,
    private gameService: GameService
  ) { }

  ngOnInit() {
    this.http.get(`${this.gameService.apiUrl}/festivals`)
      .pipe(map((x: any) => x.festivals))
      .subscribe(festivals => {
        this.festivals = sortBy(
          festivals.filter((x: IFestival) => this.isFestivalValid(x)),
          fest => !fest.startedBy.includes(this.gameService.playerRef.name)
        );
        this.aggregate = this.festivalAggregate(this.festivals);
        this.isLoaded = true;
      });
  }

  public festivalAggregate(festivals: IFestival[]): any {
    const aggStats = { stats: {} }

    for (let o of festivals) {
      for (let [k, v] of Object.entries(o.stats)) {
        if (!aggStats.stats[k]) {
          aggStats.stats[k] = v
        } else {
          aggStats.stats[k] += v
        }
      }
    }

    return aggStats;
  }

  public isFestivalValid(festival: IFestival): boolean {
    return festival.endTime > Date.now();
  }

}
