import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { IAdventure, IPet, IPlayer } from '../../../shared/interfaces';

@Component({
  selector: 'app-pets',
  templateUrl: './tab-pets.page.html',
  styleUrls: [],
})
export class PetsPage implements OnInit {

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  public hasBuyablePets(player: IPlayer): boolean {
    if(!player.$petsData) return false;
    return Object.keys(player.$petsData.buyablePets).length > 0;
  }

  public canAnyPetGather(player: IPlayer): boolean {
    return Object.values(player.$petsData.allPets).some((pet: IPet) => {
      if(!pet.gatherTick) return false;
      if(pet.gatherTick <= Date.now()) return true;
      return false;
    });
  }

  public isAnyAdventureComplete(adventures: IAdventure[]): boolean {
    return adventures.some(x => x.finishAt && x.finishAt < Date.now());
  }

}
