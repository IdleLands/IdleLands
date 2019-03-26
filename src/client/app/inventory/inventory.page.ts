import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { GameService } from '../game.service';
import { IItem } from '../../../shared/interfaces';
import { InventoryItemPopover } from './item.popover';
import { InventoryActionsPopover } from './invactions.popover';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage {

  constructor(
    private popoverCtrl: PopoverController,
    public gameService: GameService
  ) { }

  public async openItemMenu($event, item: IItem) {
    const popover = await this.popoverCtrl.create({
      component: InventoryItemPopover,
      componentProps: { item },
      event: $event,
      translucent: true
    });

    return await popover.present();
  }

  public async openAllMenu($event) {
    const popover = await this.popoverCtrl.create({
      component: InventoryActionsPopover,
      componentProps: { },
      event: $event,
      translucent: true
    });

    return await popover.present();
  }

}
