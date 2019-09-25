import { Component, OnInit } from '@angular/core';
import { SocketClusterService } from '../socket-cluster.service';
import { GameService } from '../game.service';
import { ServerEventName, IBuffScrollItem } from '../../../shared/interfaces';
import { PopoverController } from '@ionic/angular';
import { ResourcesPopover } from './resources.popover';

@Component({
  selector: 'app-enhancement-materials',
  templateUrl: './enhancement-materials.page.html',
  styleUrls: ['./enhancement-materials.page.scss'],
})
export class EnhancementMaterialsPage implements OnInit {

  public crystals = [
    { name: 'Red',    color: '#a00' },
    { name: 'Orange', color: '#fa5' },
    { name: 'Yellow', color: '#aa0' },
    { name: 'Green',  color: '#0a0' },
    { name: 'Blue',   color: '#00a' },
    { name: 'Purple', color: '#a0a' },
    { name: 'Astral' }
  ];

  constructor(
    private popoverCtrl: PopoverController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
    this.gameService.loadGuild();
  }

  useTeleportScroll(scroll: string) {
    this.socketService.emit(ServerEventName.ItemTeleportScroll, { scroll });
  }

  canSeeBuffScroll(scroll: IBuffScrollItem): boolean {
    return Date.now() < scroll.expiresAt;
  }

  useBuffScroll(scrollId: string) {
    this.socketService.emit(ServerEventName.ItemBuffScroll, { scrollId });
  }

  async resourcesActions($event, playerResources, guildResources) {
    $event.preventDefault();
    $event.stopPropagation();

    const popover = await this.popoverCtrl.create({
      component: ResourcesPopover,
      componentProps: {
        donateAllCallback: () => {
          this.socketService.emit(ServerEventName.GuildDonateAllSalvagedResources, {playerResources, guildResources});
        }
      },
      event: $event,
      translucent: true
    });

    return await popover.present();
  }
}
