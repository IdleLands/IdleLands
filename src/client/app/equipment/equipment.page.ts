import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { GameService } from '../game.service';
import { EquipmentItemPopover } from './item.popover';
import { IItem, ItemSlot } from '../../../shared/interfaces';

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
    public gameService: GameService
  ) { }

  public async openItemMenu($event, item: IItem, slot: ItemSlot) {
    const popover = await this.popoverCtrl.create({
      component: EquipmentItemPopover,
      componentProps: { item, slot },
      event: $event,
      translucent: true
    });

    return await popover.present();
  }

}
