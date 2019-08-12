import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonContent, PopoverController } from '@ionic/angular';

import { compact, difference, get } from 'lodash';
import { timer, Subject, Subscription } from 'rxjs';

import * as Phaser from 'phaser-ce';

import { GameService } from '../game.service';
import { IPlayer, ServerEventName } from '../../../shared/interfaces';
import { GenderPositions } from '../_shared/gendervatar/genders';
import { SocketClusterService } from '../socket-cluster.service';
import { RevGidMap } from '../../../server/core/static/tile-data';
import { PersonalitiesPopover } from './personalities.popover';

class GameState extends Phaser.State {

  private playerTimer$: any;
  private player$: any;

  private player: IPlayer;
  private map: string;

  private objectSpriteGroup: Phaser.Group;
  private playerSpriteGroup: Phaser.Group;
  private currentPetSprite: Phaser.Sprite;
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
      `${this.apiUrl}/map?map=${encodeURIComponent(this.player.map)}`, null, Phaser.Tilemap.TILED_JSON);
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
    this.frames = (this.frames + 1);

    if(this.frames % 13 === 0) {
      if(this.currentPlayerSprite) {
        try {
          this.game.debug.spriteBounds(this.currentPlayerSprite, this.frameColors[this.frames % this.frameColors.length], false);
        } catch(e) {}
      }

      if(this.currentDivineSprite) {
        try {
          this.game.debug.spriteBounds(this.currentDivineSprite, this.frameColors[this.frames % this.frameColors.length], false);
        } catch(e) {}
      }
    }

    if(this.frames > 600) this.frames = 0;
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

          let affix = '';

          if(item.realtype === 'Boss' && this.player.cooldowns && this.player.cooldowns[nameValue] > Date.now()) {
            const availableAt = new Date(this.player.cooldowns[nameValue]);
            affix = `[Available: ${availableAt.toLocaleString()}]`;
          }

          if(item.realtype === 'Treasure' && this.player.cooldowns && this.player.cooldowns[nameValue] > Date.now()) {
            const availableAt = new Date(this.player.cooldowns[nameValue]);
            affix = `[Available: ${availableAt.toLocaleString()}]`;
          }

          if(item.realtype === 'Collectible' && this.player.$collectiblesData && this.player.$collectiblesData.collectibles[item.name]) {
            affix = '[Owned!]';
          }

          strings.push(`${item.realtype}${nameValue ? ': ' + nameValue : ''} ${affix}`);
        }

        if(item.flavorText) {
          strings.push('');
          strings.push(`"${item.flavorText}"`);
        }

        const baseRequirements = [
          { key: 'Achievement',
            hasMet: (player, val) => player.$achievementsData && player.$achievementsData.achievements[val] },
          { key: 'Boss', display: 'Boss Kill',
            hasMet: (player, val) => player.$statisticsData && get(player.$statisticsData.statistics, ['BossKill', 'Total', val]) },
          { key: 'Class',
            hasMet: (player, val) => player.profession === val },
          { key: 'Collectible',
            hasMet: (player, val) => player.$collectiblesData && player.$collectiblesData.collectibles[val]
                                  && player.$collectiblesData.collectibles[val].foundAt > 0 },
          { key: 'Holiday' },
          { key: 'Map', display: 'Map Visited',
            hasMet: (player, val) => player.$statisticsData && get(player.$statisticsData.statistics, ['Map', val]) },
          { key: 'Ascension', display: 'Ascension Level',
            hasMet: (player, val) => player.ascensionLevel >= val }
        ];

        const requirements = compact(baseRequirements.map(({ key, display, hasMet }) => {
          const req = item[`require${key}`];
          if(!req) return null;

          const bonus = hasMet && hasMet(this.player, req) ? ' [Met]' : '';

          return `${display || key}: ${req}${bonus}`;
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
    const prevPlayer = this.player;
    this.player = player;

    if(!player) {
      return;
    }

    await this.isReady;
    await this.updatePlayerSprite(player as any);
    this.camera.follow(this.currentPlayerSprite);

    // restart the state if needed
    if(this.map && this.map !== player.map) {
      this.map = '';
      this.objectSpriteGroup.destroy();
      this.playerSpriteGroup.destroy();
      if(this.currentDivineSprite) {
        this.currentDivineSprite.destroy();
        this.currentDivineSprite = null;
      }
      if(this.currentPetSprite) {
        this.currentPetSprite.destroy();
        this.currentPetSprite = null;
      }
      this.allPlayerSprites = {};
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
      if(this.currentPetSprite) this.currentPetSprite.destroy();

      if(this.player.divineDirection) {
        this.currentDivineSprite = this.game.add.sprite(
          this.player.divineDirection.x * 16, this.player.divineDirection.y * 16,
          'interactables', +(RevGidMap.PurpleTeleport) - 1
        );
        this.currentDivineSprite.moveDown();
      }

      if(this.player.$premiumData.tier && this.player.lastLoc && this.player.lastLoc.map === this.player.map) {
        const curPet = this.player.$petsData.allPets[this.player.$petsData.currentPet];
        const petGenderRef = GenderPositions[curPet.gender] || { x: 5, y: 1 };
        const petGenderNum = (genderRef.y * 9) + petGenderRef.x;

        this.currentPetSprite = this.game.add.sprite(
          this.player.lastLoc.x * 16, this.player.lastLoc.y * 16,
          'interactables', petGenderNum
        );
        this.currentPetSprite.moveDown();

        this.currentPetSprite.inputEnabled = true;

        this.currentPetSprite.events.onInputDown.add(() => this.stored.gameText.next([`Pet: ${curPet.name}`]));
        this.currentPetSprite.events.onInputOver.add(() => this.stored.gameText.next([`Pet: ${curPet.name}`]));

        this.currentPetSprite.events.onInputOut.add(() => this.stored.gameText.next(null));
      }

    }

    if(isNew) {
      sprite.inputEnabled = true;

      const addText = () => {
        this.stored.gameText.next([
          `Player: ${player.name}${player.title ? ', the ' + player.title : ''}`,
          `Level ${player.level.__current ? player.level.__current : player.level} ${player.profession}`
        ]);

        setTimeout(() => {
          this.stored.gameText.next(null);
        }, 5000);
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

  public ddStepsLeft: number;

  private game: Phaser.Game;
  public gameText = new Subject<string[]>();
  private gameText$: Subscription;
  private player$: Subscription;

  constructor(
    private popoverCtrl: PopoverController,
    private socketService: SocketClusterService,
    private gameService: GameService
  ) { }

  async ngOnInit() {
    const el = await this.content.getScrollElement();

    (<any>window).PhaserGlobal = { hideBanner: true };

    this.player$ = this.gameService.player$.subscribe(player => {
      if(player) {
        this.ddStepsLeft = player.divineDirection ? player.divineDirection.steps : 0;
      }

      if(!player || this.game) return;

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
    });
  }

  ngOnDestroy() {
    if(this.game) this.game.destroy();
    if(this.gameText$) this.gameText$.unsubscribe();
    if(this.player$) this.player$.unsubscribe();
  }

  public async showPersonalities($event) {
    const popover = await this.popoverCtrl.create({
      component: PersonalitiesPopover,
      componentProps: { },
      event: $event,
      cssClass: 'translucent-popover',
      showBackdrop: false,
      translucent: true
    });

    return await popover.present();
  }

}
