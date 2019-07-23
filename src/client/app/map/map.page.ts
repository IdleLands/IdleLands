import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

import { compact, difference } from 'lodash';
import { timer, Subject, Subscription } from 'rxjs';

import * as Phaser from 'phaser-ce';

import { GameService } from '../game.service';
import { IPlayer, ServerEventName } from '../../../shared/interfaces';
import { GenderPositions } from '../_shared/gendervatar/genders';
import { SocketClusterService } from '../socket-cluster.service';
import { RevGidMap } from '../../../server/core/static/tile-data';

class GameState extends Phaser.State {

  private playerTimer$: any;
  private player$: any;

  private player: IPlayer;
  private map: string;

  private objectSpriteGroup: Phaser.Group;
  private playerSpriteGroup: Phaser.Group;
  private currentDivineSprite: Phaser.Sprite;
  private allPlayerSprites: { [key: string]: Phaser.Sprite } = {};

  private get currentPlayerSprite(): Phaser.Sprite {
    if(!this.player) return null;
    return this.allPlayerSprites[this.player.name];
  }

  private baseUrl: string;
  private apiUrl: string;

  private stored: any;
  private isReady: Promise<boolean>;
  private isReadyCb: Function;

  private frameColors = ['#000', '#f00', '#0f0', '#00f'];
  private frames = 0;

  init({ gameService, gameText, socketService }) {
    this.stage.disableVisibilityChange = true;
    this.load.crossOrigin = 'anonymous';

    this.camera.lerp = new Phaser.Point(0.5, 0.5);

    this.baseUrl = gameService.baseUrl;
    this.apiUrl = gameService.apiUrl;

    this.stored = { gameService, gameText, socketService, };

    this.setPlayer(gameService.player$.getValue());
    this.player$ = gameService.player$.subscribe(player => this.setPlayer(player));

    this.isReady = new Promise(resolve => this.isReadyCb = resolve);
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
    this.watchDivineSteps();

    this.isReadyCb();
  }

  update() {
    if(!this.currentPlayerSprite || this.currentPlayerSprite.x === 0) return;
    this.camera.follow(this.currentPlayerSprite);
  }

  render() {
    this.frames = (this.frames + 1) % this.frameColors.length;

    if(this.currentPlayerSprite) {
      this.game.debug.spriteBounds(this.currentPlayerSprite, this.frameColors[this.frames], false);
    }

    if(this.currentDivineSprite) {
      try {
        this.game.debug.spriteBounds(this.currentDivineSprite, this.frameColors[this.frames], false);
      } catch(e) {}
    }
  }

  shutdown() {
    if(this.player$) this.player$.unsubscribe();
    if(this.playerTimer$) this.playerTimer$.unsubscribe();
  }

  private watchDivineSteps() {
    this.game.input.onDown.add(() => {
      const x = Math.floor((this.game.camera.x + this.game.input.activePointer.x) / 16);
      const y = Math.floor((this.game.camera.y + this.game.input.activePointer.y) / 16);

      this.stored.socketService.emit(ServerEventName.CharacterDivineDirection, { x, y });
    });
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

      const players = this.stored.gameService.getPlayerLocationsInCurrentMap();

      const curPlayers = Object.keys(this.allPlayerSprites);
      const newPlayers = players.map(x => x.name);

      players.forEach(player => {
        if(player.name === this.player.name) return;

        this.updatePlayerSprite(player);
      });

      difference(curPlayers, newPlayers).forEach(removePlayer => {
        if(!this.allPlayerSprites[removePlayer] || removePlayer === this.player.name) return;
        this.allPlayerSprites[removePlayer].destroy();
      });

    });
  }

  private async setPlayer(player: IPlayer): Promise<void> {

    // set player
    this.player = player;

    if(!player) return;

    await this.isReady;
    await this.updatePlayerSprite(player as any);
    this.camera.follow(this.currentPlayerSprite);

    // restart the state if needed
    if(this.map && this.map !== player.map) {
      this.map = '';
      this.game.state.restart(true, true, this.stored);
    }

    // update the map for state restart watching
    this.map = player.map;

    setTimeout(() => {
      this.camera.position = new Phaser.Point(this.player.x * 16, this.player.y * 16);
    });
  }

  private async updatePlayerSprite(
    player: { x: number, y: number, name: string, gender: string, level: number|any, profession: string, title: string }
  ): Promise<void> {
    await this.isReady;

    const genderRef = GenderPositions[player.gender] || { x: 5, y: 1 };
    const genderNum = (genderRef.y * 9) + genderRef.x;

    const group = player.name === this.player.name ? undefined : this.playerSpriteGroup;

    let sprite = this.allPlayerSprites[player.name];
    let isNew = false;
    if(!sprite) {
      sprite = this.game.add.sprite(player.x * 16, player.y * 16, 'interactables', genderNum, group);
      this.allPlayerSprites[player.name] = sprite;
      isNew = true;
    }

    sprite.frame = genderNum;
    sprite.x = player.x * 16;
    sprite.y = player.y * 16;

    if(player.name === this.player.name) {
      if(this.currentDivineSprite) this.currentDivineSprite.destroy();

      if(this.player.divineDirection) {
        this.currentDivineSprite = this.game.add.sprite(
          this.player.divineDirection.x * 16, this.player.divineDirection.y * 16,
          'interactables', +(RevGidMap.PurpleTeleport) - 1
        );
        this.currentDivineSprite.moveDown();
      }
    }

    if(isNew) {
      sprite.inputEnabled = true;

      const addText = () => {
        this.stored.gameText.next([
          `Player: ${player.name}${player.title ? ', the ' + player.title : ''}`,
          `Level ${player.level.__current ? player.level.__current : player.level} ${player.profession}`
        ]);
      };

      const removeText = () => {
        this.stored.gameText.next(null);
      };

      sprite.events.onInputDown.add(addText);
      sprite.events.onInputOver.add(addText);

      sprite.events.onInputOut.add(removeText);
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

  private game: Phaser.Game;
  private gameText = new Subject<string[]>();
  private gameText$: Subscription;

  constructor(
    private socketService: SocketClusterService,
    private gameService: GameService
  ) { }

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
      socketService: this.socketService,
      gameService: this.gameService,
      gameText: this.gameText
    });
  }

  ngOnDestroy() {
    if(this.game) this.game.destroy();
    if(this.gameText$) this.gameText$.unsubscribe();
  }

}
