import { Injectable } from '@angular/core';
import { IAdventure, IPet, IPlayer} from '../../shared/interfaces';


@Injectable({
  providedIn: 'root'
})
export class UiService {
  public hasBuyablePets(player: IPlayer): boolean {
    if(!player.$petsData) return false;
    return Object.keys(player.$petsData.buyablePets).length > 0;
  }

  public canAnyPetGather(player: IPlayer): boolean {
    return Object.values(player.$petsData.allPets).some((pet: IPet) => {
      if(!pet.gatherTick) return false;
      return pet.gatherTick <= Date.now();
    });
  }

  public isAnyAdventureComplete(adventures: IAdventure[]): boolean {
    return adventures.some(x => x.finishAt && x.finishAt < Date.now());
  }
}
