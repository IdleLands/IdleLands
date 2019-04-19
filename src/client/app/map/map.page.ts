import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { compact } from 'lodash';
import { timer, Subject, Subscription } from 'rxjs';

import * as Phaser from 'phaser-ce';

import { GameService } from '../game.service';
import { IPlayer } from '../../../shared/interfaces';
import { GenderPositions } from '../_shared/gendervatar/genders';

class GameState extends Phaser.State {

  private playerTimer$: any;
  private player$: any;

  private player: IPlayer;
  private map: string;

  private objectSpriteGroup: Phaser.Group;
  private playerSpriteGroup: Phaser.Group;
  private currentPlayerSprite: Phaser.Sprite;

  private baseUrl: string;
  private apiUrl: string;

  private stored: any;
  private isReady: boolean;

  init({ gameService, gameText }) {
    this.stage.disableVisibilityChange = true;
    this.load.crossOrigin = 'anonymous';

    this.camera.lerp = new Phaser.Point(0.5, 0.5);

    this.baseUrl = gameService.baseUrl;
    this.apiUrl = gameService.apiUrl;

    this.stored = { gameService, gameText };

    this.setPlayer(gameService.player$.getValue());
    this.player$ = gameService.player$.subscribe(player => this.setPlayer(player));
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

    this.objectSpriteGroup = this.add.group();

    for(let i = 0; i < this.cache.getFrameCount('interactables'); i++) {
      map.createFromObjects('Interactables', i, 'interactables', i - 1, true, false, this.objectSpriteGroup);
    }

    this.addObjectEvents();
    this.watchPlayerUpdates();

    this.isReady = true;
  }

  update() {
    if(!this.currentPlayerSprite || this.currentPlayerSprite.x === 0) return;
    this.camera.follow(this.currentPlayerSprite);
  }

  render() {
    if(!this.currentPlayerSprite) return;
    this.game.debug.spriteBounds(this.currentPlayerSprite, '#000', false);
  }

  shutdown() {
    this.player$.unsubscribe();
    this.playerTimer$.unsubscribe();
  }

  private addObjectEvents() {
    this.objectSpriteGroup.forEach(item => {
      item.inputEnabled = true;

      const addText = () => {
        const strings = [];

        const nameKey = item.teleportMap ? 'teleportMap' : 'name';
        if(item.realtype) {
          const nameValue = item[nameKey];
          strings.push(`${item.realtype}${nameValue ? ': ' + nameValue : ''}`);
        }

        if(item.flavorText) {
          strings.push('');
          strings.push(`"${item.flavorText}"`);
        }

        const baseRequirements = [
          { key: 'Achievement' },
          { key: 'Boss', display: 'Boss Kill' },
          { key: 'Class' },
          { key: 'Collectible' },
          { key: 'Holiday' },
          { key: 'Region', display: 'Region Visited' },
          { key: 'Map', display: 'Map Visited' },
          { key: 'Ascension', display: 'Ascension Level' }
        ];

        const requirements = compact(baseRequirements.map(({ key, display }) => {
          const req = item[`require${key}`];
          if(!req) return null;

          return `${display || key}: ${req}`;
        }));

        if(requirements.length > 0) {
          requirements.unshift('------------------------');
          requirements.unshift('Requirements');
          requirements.unshift('');

          strings.push(...requirements);
        }

        this.stored.gameText.next(strings);
      };

      const removeText = () => {
        this.stored.gameText.next(null);
      };

      item.events.onInputDown.add(addText);
      item.events.onInputOver.add(addText);

      item.events.onInputOut.add(removeText);
    });
  }

  private watchPlayerUpdates() {
    this.playerSpriteGroup = this.add.group();

    this.playerTimer$ = timer(0, 5000).subscribe(() => {
      if(!this.stored.gameService.loggedInAndConnected) return;

      this.playerSpriteGroup.removeAll();

      this.stored.gameService.getPlayerLocationsInCurrentMap().subscribe(players => {
        players.forEach(player => {
          if(player.name === this.player.name) return;

          this.updatePlayerSprite(player);
        });
      });
    });
  }

  private setPlayer(player: IPlayer): void {
    // set player
    this.player = player;

    if(!player) return;

    this.updatePlayerSprite(player);

    // restart the state if needed
    if(this.map && this.map !== player.map) {
      this.map = '';
      this.game.state.restart(true, true, this.stored);
    }

    // update the map for state restart watching
    this.map = player.map;
  }

  private updatePlayerSprite(player: { x: number, y: number, name: string, gender: string }): void {
    if(!this.isReady) return;

    const genderRef = GenderPositions[player.gender] || { x: 5, y: 1 };
    const genderNum = (genderRef.y * 9) + genderRef.x;

    const group = player.name === this.player.name ? undefined : this.playerSpriteGroup;
    const sprite = this.game.add.sprite(player.x * 16, player.y * 16, 'interactables', genderNum, group);

    if(player.name === this.player.name) {
      if(this.currentPlayerSprite) this.currentPlayerSprite.destroy();
      this.currentPlayerSprite = sprite;
    }

    sprite.inputEnabled = true;

    const addText = () => {
      this.stored.gameText.next([`Player: ${player.name}`]);
    };

    const removeText = () => {
      this.stored.gameText.next(null);
    };

    sprite.events.onInputDown.add(addText);
    sprite.events.onInputOver.add(addText);

    sprite.events.onInputOut.add(removeText);
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

  private game: Phaser.Game;
  private gameText = new Subject<string[]>();
  private gameText$: Subscription;

  constructor(private gameService: GameService) { }

  async ngOnInit() {
    const el = await this.content.getScrollElement();

    (<any>window).PhaserGlobal = { hideBanner: true };

    this.game = new Phaser.Game({
      parent: el,
      renderer: Phaser.AUTO,
      width: el.clientWidth,
      height: el.clientHeight
    });

    this.game.state.add('game', GameState);
    this.game.state.start('game', true, true, {
      gameService: this.gameService,
      gameText: this.gameText
    });
  }

  ngOnDestroy() {
    if(this.game) this.game.destroy();
    if(this.gameText$) this.gameText$.unsubscribe();
  }

}
