import { Component, OnInit } from '@angular/core';
import { SocketClusterService } from '../socket-cluster.service';
import { GameService } from '../game.service';
import { ItemSlot, IItem, ServerEventName } from '../../../shared/interfaces';
import { PopoverController } from '@ionic/angular';

import { EquipmentItemPopover } from '../_shared/equipment/equipmentitem.popover';

@Component({
  selector: 'app-petcurrentequipment',
  templateUrl: './petcurrentequipment.page.html',
  styleUrls: ['./petcurrentequipment.page.scss'],
})
export class PetcurrentequipmentPage implements OnInit {

  public slots = [
    'soul', 'body', 'charm', 'feet', 'finger', 'hands', 'head', 'legs', 'mainhand', 'neck', 'offhand'
  ];

  constructor(
    private popoverCtrl: PopoverController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  async openItemMenu($event, item: IItem, slot: ItemSlot) {
    const popover = await this.popoverCtrl.create({
      component: EquipmentItemPopover,
      componentProps: {
        item,
        slot,
        somethingElseCallback: (chosenItem) => {
          if(item) {
            this.socketService.emit(ServerEventName.PetEquip, { itemId: chosenItem.id, unequipId: item.id, unequipSlot: item.type });
            return;
          }
          this.socketService.emit(ServerEventName.PetEquip, { itemId: chosenItem.id });
        },
        unequipCallback: () => {
          this.socketService.emit(ServerEventName.PetUnequip, { itemSlot: item.type, itemId: item.id });
        }
      },
      event: $event,
      translucent: true
    });

    return await popover.present();
  }

}
