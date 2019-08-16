import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { Profession, GoldGenderCost, ServerEventName } from '../../../shared/interfaces';

@Component({
  selector: 'app-premium-gold',
  templateUrl: './premium-gold.page.html',
  styleUrls: ['./premium-gold.page.scss'],
})
export class PremiumGoldPage implements OnInit {

  public genders = Object.values(Profession).map(prof => {
    return {
      cost: GoldGenderCost[prof],
      name: `Gold ${prof}`,
      key: `${prof}-gold`
    };
  });

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  buyGender(gender) {
    this.socketService.emit(ServerEventName.PremiumGoldGender, { gender: gender.key });
  }

}
