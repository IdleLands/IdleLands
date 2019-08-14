import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-collectibles',
  templateUrl: './collectibles.page.html',
  styleUrls: ['./collectibles.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectiblesPage implements OnInit {

  constructor(
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

}
