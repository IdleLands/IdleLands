import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { GameService } from '../game.service';
import { EquipmentItemPopover } from '../_shared/equipment/equipmentitem.popover';
import { IItem, ItemSlot, ServerEventName } from '../../../shared/interfaces';
import { SocketClusterService } from '../socket-cluster.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.page.html',
  styleUrls: ['./equipment.page.scss'],
})
export class EquipmentPage {

  public slots = [
    'body', 'charm', 'feet', 'finger', 'hands', 'head', 'legs', 'mainhand', 'neck', 'offhand',
    'providence', 'soul', 'trinket'
  ];

  constructor(
    private popoverCtrl: PopoverController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  public async openItemMenu($event, item: IItem, slot: ItemSlot) {
    const popover = await this.popoverCtrl.create({
      component: EquipmentItemPopover,
      componentProps: {
        item,
        slot,
        somethingElseCallback: (chosenItem) => {
          this.socketService.emit(ServerEventName.ItemEquip, { itemId: chosenItem.id });
        },
        unequipCallback: () => {
          this.socketService.emit(ServerEventName.ItemUnequip, { itemSlot: item.type });
        },
        lockCallback: (chosenItem, isLocked) => {
          if(isLocked) {
            this.socketService.emit(ServerEventName.ItemLock, { itemSlot: chosenItem.type });
          } else {
            this.socketService.emit(ServerEventName.ItemUnlock, { itemSlot: chosenItem.type });
          }
        }
      },
      event: $event,
      translucent: true
    });

    return await popover.present();
  }

}
