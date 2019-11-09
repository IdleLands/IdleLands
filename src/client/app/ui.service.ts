import { Injectable } from '@angular/core';
import { IAdventure, IPet, IPlayer } from '../../shared/interfaces';


@Injectable({
  providedIn: 'root'
})
export class UiService {
  public hasBuyablePets(player: IPlayer): boolean {
    if (!player.$petsData) return false;
    return Object.keys(player.$petsData.buyablePets).length > 0;
  }

  public canAnyPetGather(player: IPlayer): boolean {
    return Object.values(player.$petsData.allPets).some((pet: IPet) => {
      if (!pet.gatherTick) return false;
      return pet.gatherTick <= Date.now();
    });
  }

  public isAnyAdventureComplete(adventures: IAdventure[]): boolean {
    return adventures.some(x => x.finishAt && x.finishAt < Date.now());
  }

  public canDoPremium(player: IPlayer) {
    return player.$premiumData.gachaFreeRolls['Astral Gate'] < Date.now();
  }

  public isPetsAdventureCompleted(player: IPlayer): any {
    if (!player.$petsData) return false;

    const anyComplete = player.$petsData.adventures.some(x => x.finishAt && x.finishAt < Date.now());

    const anyGather = Object.values(player.$petsData.allPets).some((pet: IPet) => {
      if (!pet.gatherTick) return false;
      if (pet.gatherTick <= Date.now()) return true;
      return false;
    });

    if (!anyComplete && !anyGather) return false;

    return anyComplete ? 'Complete' : 'Gather';
  }

  public canDoFreeRolls(player: IPlayer): any {
    if (!player.$premiumData) return false;

    const canDoFree = player.$premiumData.gachaFreeRolls['Astral Gate'] < Date.now();
    if (!canDoFree) return false;

    return 'Free Roll';
  }

  public isAnyQuestComplete(player: IPlayer): any {
    if (!player.$questsData) return false;

    const anyComplete = player.$questsData.quests.some(x => x.objectives.every(obj => obj.progress >= obj.statisticValue));
    if (!anyComplete) return false;

    return 'Complete';
  }

  public isSettingsUnSynced(player: IPlayer): any {
    if (player.authId) return false;
    return 'Unsynced';
  }

  public getPlayerScrolls(player: IPlayer): any {
    if (!player.$inventoryData || !player.$inventoryData.buffScrolls || !player.$inventoryData.buffScrolls.length) return false;
    return player.$inventoryData.buffScrolls.length + ' Scroll(s)';
  }

  public isPlayerInventoryFull(player: IPlayer): any {
    if(!player.$inventoryData || !player.$inventoryData.items) return false;
    return player.$inventoryData.items.length >= player.$inventoryData.size ? 'Full Inventory' : false;
  }

}
