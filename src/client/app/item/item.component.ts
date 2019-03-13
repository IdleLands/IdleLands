import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { merge } from 'lodash';
import { Sprite, SpriteCanvasHelper } from 'mixel';

import * as SlotMasks from './slot-masks';
import * as SlotOptions from './slot-options';
import { IItem } from '../../../shared/interfaces';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit, OnDestroy {

  @ViewChild('canvasContainer')
  public canvasContainer;

  private _item: IItem;

  @Input()
  public set item(item: IItem) {
    this._item = item;
  }
  public get item() {
    if(this._item) return this._item;

    return <IItem> {
      enchantLevel: 0,
      itemClass: 'basic',
      name: 'nothing',
      stats: { str: 0, dex: 0, int: 0, con: 0, agi: 0, luk: 0 }
    };
  }

  @Input() public slot: string;
  @Input() public scale = 6;

  private canvas: HTMLCanvasElement;

  ngOnInit() {
    if(this.item.name === 'nothing') return;

    const mask = SlotMasks[this.slot];
    if(!mask) return;

    const sprite = new Sprite(mask, merge({}, (SlotOptions[this.slot] || {}), {
      colored: true,
      seed: this.item.name
    }));

    const canvas = SpriteCanvasHelper.createCanvas(sprite);
    const scaledCanvas = SpriteCanvasHelper.resizeCanvas(canvas, this.scale);

    this.canvas = scaledCanvas;

    this.canvasContainer.nativeElement.appendChild(this.canvas);
  }

  ngOnDestroy() {
    this.canvas.remove();
  }

}
