import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameService } from '../game.service';
import { map } from 'rxjs/operators';
import { IFestival } from '../../../shared/interfaces';

@Component({
  selector: 'app-festivals',
  templateUrl: './festivals.page.html',
  styleUrls: ['./festivals.page.scss'],
})
export class FestivalsPage implements OnInit {

  public festivals: IFestival[] = [];

  constructor(
    private http: HttpClient,
    private gameService: GameService
  ) { }

  ngOnInit() {
    this.http.get(`${this.gameService.apiUrl}/festivals`)
      .pipe(map((x: any) => x.festivals))
      .subscribe(festivals => {
        this.festivals = festivals;
      });
  }

}
