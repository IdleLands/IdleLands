import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { GameService } from '../game.service';
import { EquipmentItemPopover } from './item.popover';
import { IItem } from '../../../shared/interfaces';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.page.html',
  styleUrls: ['./equipment.page.scss'],
})
export class EquipmentPage implements OnInit {

  public slots = [
    'body', 'charm', 'feet', 'finger', 'hands', 'head', 'legs', 'mainhand', 'neck', 'offhand',
    'providence', 'soul', 'trinket'
  ];

  constructor(
    private popoverCtrl: PopoverController,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  public async openItemMenu($event, item: IItem) {
    const popover = await this.popoverCtrl.create({
      component: EquipmentItemPopover,
      componentProps: { item },
      event: $event,
      translucent: true
    });

    return await popover.present();
  }

}
