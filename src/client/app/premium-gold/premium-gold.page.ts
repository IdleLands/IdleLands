import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { Profession, GoldGenderCost, ServerEventName, PremiumGoldCollectibles } from '../../../shared/interfaces';

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

  public collectibles = Object.keys(PremiumGoldCollectibles).map(collectible => {
    return {
      cost: PremiumGoldCollectibles[collectible],
      key: collectible
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

  totalSpent(playerCollectibles) {
    let sum = 0;
    Object.keys(PremiumGoldCollectibles).map(collectible => {
      if(playerCollectibles[collectible]) sum += (PremiumGoldCollectibles[collectible] * playerCollectibles[collectible].touched);
    });
    return sum.toLocaleString();
  }

  buyGoldCollectible(collectible) {
    this.socketService.emit(ServerEventName.PremiumGoldCollectible, { collectible: collectible.key });
  }

}
