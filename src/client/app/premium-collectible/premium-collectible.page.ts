import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { PremiumGoldCollectibles, ServerEventName } from '../../../shared/interfaces';

@Component({
  selector: 'app-premium-collectible',
  templateUrl: './premium-collectible.page.html',
  styleUrls: ['./premium-collectible.page.scss'],
})
export class PremiumCollectiblePage implements OnInit {

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
