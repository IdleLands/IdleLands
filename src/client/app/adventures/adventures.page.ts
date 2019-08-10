import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { AdventureNames, AdventureDescriptions, IAdventure, ServerEventName, IPlayer, IPet } from '../../../shared/interfaces';
import { ChoosePetsModal } from './choosepets.modal';

@Component({
  selector: 'app-adventures',
  templateUrl: './adventures.page.html',
  styleUrls: ['./adventures.page.scss'],
})
export class AdventuresPage implements OnInit, OnDestroy {

  public get adventureNames() {
    return AdventureNames;
  }

  public get adventureDescs() {
    return AdventureDescriptions;
  }

  private rewardsCb: Function;

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
    this.rewardsCb = ({ rewards, adventure }) => this.gameService.showRewards(this.adventureNames[adventure.type], rewards);
    this.socketService.register(ServerEventName.PetAdventureRewards, this.rewardsCb);
  }

  ngOnDestroy() {
    this.socketService.unregister(ServerEventName.PetAdventureRewards, this.rewardsCb);
  }

  public isAdventureDone(adventure: IAdventure) {
    return adventure.finishAt < Date.now();
  }

  public petsOnAdventure(player: IPlayer, adventure: IAdventure) {
    if(!player) return '';

    const pets = player.$petsData.allPets;
    return Object.values(pets)
            .filter((x: IPet) => x.currentAdventureId === adventure.id)
            .map((x: IPet) => `${x.name} (${x.typeName})`)
            .join(', ');
  }

  public async embark(adventure: IAdventure) {
    const modal = await this.modalCtrl.create({
      component: ChoosePetsModal
    });

    await modal.present();

    const res = await modal.onDidDismiss();
    if(res.data && res.data.length > 0) {
      this.socketService.emit(ServerEventName.PetAdventureEmbark, { adventureId: adventure.id, petIds: res.data });
    }
  }

  public collect(adventure: IAdventure) {
    this.socketService.emit(ServerEventName.PetAdventureFinish, { adventureId: adventure.id });
  }

}
