import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { timer } from 'rxjs';

import * as Phaser from 'phaser-ce';

import { GameService } from '../game.service';
import { IPlayer } from '../../../shared/interfaces';
import { GenderPositions } from '../_shared/gendervatar/genders';

class GameState extends Phaser.State {

  private playerTimer$: any;
  private player$: any;

  private player: IPlayer;
  private map: string;

  private playerSpriteGroup: Phaser.Group;
  private currentPlayerSprite: Phaser.Sprite;

  private baseUrl: string;
  private apiUrl: string;

  private stored: any;

  init({ gameService, player$ }) {
    this.stage.disableVisibilityChange = true;
    this.load.crossOrigin = 'anonymous';

    this.camera.lerp = new Phaser.Point(0.5, 0.5);

    this.baseUrl = gameService.baseUrl;
    this.apiUrl = gameService.apiUrl;

    this.stored = { gameService, player$ };

    this.setPlayer(player$.getValue());
    this.player$ = player$.subscribe(player => this.setPlayer(player));
  }

  preload() {
    this.load.image('tiles', `${this.baseUrl}/assets/tiles.png`);
    this.load.spritesheet('interactables', `${this.baseUrl}/assets/tiles.png`, 16, 16);
    this.load.tilemap(this.player.map,
      `${this.apiUrl}/api/map?map=${encodeURIComponent(this.player.map)}`, null, Phaser.Tilemap.TILED_JSON);
  }

  create() {
    const map = this.add.tilemap(this.player.map);
    map.addTilesetImage('tiles');
    map.createLayer('Terrain').resizeWorld();
    map.createLayer('Blocking');

    for(let i = 0; i < this.cache.getFrameCount('interactables'); i++) {
      map.createFromObjects('Interactables', i, 'interactables', i - 1);
    }

    // TODO: click on thing on map to get info about it

    this.playerSpriteGroup = this.add.group();

    this.playerTimer$ = timer(0, 5000).subscribe(() => {
      this.playerSpriteGroup.removeAll();

      this.stored.gameService.getPlayerLocationsInCurrentMap().subscribe(players => {
        players.forEach(player => this.updatePlayerSprite(player));
      });
    });
  }

  update() {
    if(!this.currentPlayerSprite) return;
    this.camera.position = new Phaser.Point(this.currentPlayerSprite.x, this.currentPlayerSprite.y);
  }

  render() {
    if(!this.currentPlayerSprite) return;
    this.game.debug.spriteBounds(this.currentPlayerSprite, '#000', false);
  }

  shutdown() {
    this.player$.unsubscribe();
    this.playerTimer$.unsubscribe();
  }

  private setPlayer(player: IPlayer): void {
    // set player
    this.player = player;

    // restart the state if needed
    if(this.map && this.map !== player.map) {
      this.map = '';
      this.game.state.restart(true, true, this.stored);
    }

    // update the map for state restart watching
    this.map = player.map;
  }

  private updatePlayerSprite(player: { x: number, y: number, name: string, gender: string }): void {

    const genderRef = GenderPositions[player.gender] || { x: 5, y: 1 };
    const genderNum = (genderRef.y * 9) + genderRef.x;

    const sprite = this.game.add.sprite(player.x * 16, player.y * 16, 'interactables', genderNum, this.playerSpriteGroup);

    if(player.name === this.player.name) {
      this.currentPlayerSprite = sprite;
    }
  }
}

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {

  @ViewChild(IonContent)
  private content: IonContent;

  @ViewChild('map')
  private mapDiv;

  private game: Phaser.Game;

  constructor(private gameService: GameService) { }

  async ngOnInit() {
    const el = await this.content.getScrollElement();

    this.game = new Phaser.Game({
      parent: el,
      renderer: Phaser.AUTO,
      width: el.clientWidth,
      height: el.clientHeight
    });

    this.game.state.add('game', GameState);
    this.game.state.start('game', true, true, { gameService: this.gameService, player$: this.gameService.player$ });
  }

  ngOnDestroy() {
    if(this.game) this.game.destroy();
  }

}
