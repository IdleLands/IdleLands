import { Component, OnInit, Input, OnDestroy, ViewChild, EventEmitter, Output, OnChanges } from '@angular/core';
import { merge } from 'lodash';
import { Sprite, SpriteCanvasHelper } from 'mixel';

import * as SlotMasks from './slot-masks';
import * as SlotOptions from './slot-options';
import { IItem, ItemSlot } from '../../../../shared/interfaces';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('canvasContainer', { static: false })
  public canvasContainer;

  private _item: IItem;

  @Input()
  public set item(item: IItem) {
    this._item = item;

    this.recalculateImage();
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

  @Input() public slot: ItemSlot;
  @Input() public showLock: boolean;
  @Input() public scale = 6;

  @Output() public itemMenu = new EventEmitter();

  private canvas: HTMLCanvasElement;

  private recalculateImage() {
    if(this.canvas) this.canvas.remove();
    if(this.item.name === 'nothing' || !this.item) {
      return;
    }

    const mask = SlotMasks[this.slot];
    if(!mask) return;

    const sprite = new Sprite(mask, merge({ }, (SlotOptions[this.slot] || { }), {
      colored: true,
      seed: this.item.name
    }));

    const canvas = SpriteCanvasHelper.createCanvas(sprite);
    const scaledCanvas = SpriteCanvasHelper.resizeCanvas(canvas, this.scale);

    this.canvas = scaledCanvas;

    this.canvasContainer.nativeElement.appendChild(this.canvas);
  }

  ngOnInit() {
    this.recalculateImage();
  }

  ngOnChanges(changes) {
    if(!changes) return;

    this.recalculateImage();
  }

  ngOnDestroy() {
    if(this.canvas) this.canvas.remove();
  }

  public shouldDisable(): boolean {
    return this.slot === 'providence' || this.slot === 'soul';
  }

}
