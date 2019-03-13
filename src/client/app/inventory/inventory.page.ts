import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  public slots = [
    'body', 'charm', 'feet', 'finger', 'hands', 'head', 'legs', 'mainhand', 'neck', 'offhand',
    'providence', 'soul', 'trinket'
  ];

  constructor(
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

}
