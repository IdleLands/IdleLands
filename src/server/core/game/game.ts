import { Singleton, Inject } from 'typescript-ioc';
import { DatabaseManager } from './database-manager';
import { PlayerManager } from './player-manager';

import { Player } from '../../../shared/models/entity';
import { ServerEventName, IGame, PlayerChannelOperation, IMessage, IAdventureLog, AdventureLogEventType, Channel } from '../../../shared/interfaces';
import { Logger } from '../logger';
import { ItemGenerator } from './item-generator';
import { AssetManager } from './asset-manager';
import { DiscordManager } from './discord-manager';
import { SubscriptionManager } from './subscription-manager';
import { EventManager } from './event-manager';
import { AchievementManager } from './achievement-manager';
import { PersonalityManager } from './personality-manager';
import { World } from './world';
import { MovementHelper } from './movement-helper';
import { HolidayHelper } from './holiday-helper';
import { ProfessionHelper } from './profession-helper';
import { ChatHelper } from './chat-helper';
import { PartyHelper } from './party-helper';
import { PartyManager } from './party-manager';
import { BuffManager } from './buff-manager';
import { EventName } from './events/Event';
import { PetHelper } from './pet-helper';
import { RNGService } from './rng-service';

const GAME_DELAY = process.env.GAME_DELAY ? +process.env.GAME_DELAY : 5000;
const SAVE_TICKS = process.env.NODE_ENV === 'production' ? 60 : 10;

@Singleton
export class Game implements IGame {

  @Inject public personalityManager: PersonalityManager;
  @Inject public achievementManager: AchievementManager;
  @Inject public databaseManager: DatabaseManager;
  @Inject public assetManager: AssetManager;
  @Inject public playerManager: PlayerManager;
  @Inject public itemGenerator: ItemGenerator;
  @Inject public discordManager: DiscordManager;
  @Inject public subscriptionManager: SubscriptionManager;
  @Inject public eventManager: EventManager;
  @Inject public buffManager: BuffManager;
  @Inject public movementHelper: MovementHelper;
  @Inject public holidayHelper: HolidayHelper;
  @Inject public professionHelper: ProfessionHelper;
  @Inject public chatHelper: ChatHelper;
  @Inject public partyManager: PartyManager;
  @Inject public partyHelper: PartyHelper;
  @Inject public petHelper: PetHelper;
  @Inject public rngService: RNGService;
  @Inject public world: World;
  @Inject public logger: Logger;

  private ticks = 0;

  public async init(scServer, id: number) {

    this.logger.log('Game', 'Database manager initializing...');
    await this.databaseManager.init();

    this.logger.log('Game', 'Asset manager initializing...');
    try {
      await this.assetManager.init();
    } catch(e) {
      this.logger.error(new Error('Failed to load asset manager; did you run `npm run seed`?'));
    }

    this.logger.log('Game', 'Subscription manager initializing...');
    await this.subscriptionManager.init(scServer);

    this.logger.log('Game', 'Player manager initializing...');
    await this.playerManager.init();

    this.logger.log('Game', 'Buff manager initializing...');
    await this.buffManager.init();

    this.logger.log('Game', 'Event manager initializing...');
    await this.eventManager.init();

    this.logger.log('Game', 'Party manager initializing...');
    await this.partyManager.init();

    this.logger.log('Game', 'Item generator initializing...');
    await this.itemGenerator.init();

    this.logger.log('Game', 'Achievement manager initializing...');
    await this.achievementManager.init();

    this.logger.log('Game', 'Chat helper initializing...');
    await this.chatHelper.init((msg: string) => {
      this.discordManager.sendMessage(msg);
    });

    this.logger.log('Game', 'Discord manager initializing...');
    await this.discordManager.init((msg: IMessage) => {
      this.chatHelper.sendMessageToGame(msg);
    }, id === 0);

    this.logger.log('Game', 'World initializing...');
    await this.world.init(this.assetManager.allMapAssets);

    this.loop();
  }

  public loop() {

    this.ticks++;

    // intentionally, we don't wait for each player to save (we could do for..of)
    // we just want to make sure their player event is done before we send an update
    this.playerManager.allPlayers.forEach(async player => {
      await player.loop();

      this.updatePlayer(player);

      if((this.ticks % SAVE_TICKS) === 0) {
        this.logger.log(`Game`, `Saving player ${player.name}...`);
        this.databaseManager.savePlayer(player);
      }
    });

    if(this.ticks > 600) this.ticks = 0;

    setTimeout(() => {
      this.loop();
    }, GAME_DELAY);
  }

  public updatePlayer(player: Player) {
    const patch = this.playerManager.getPlayerPatch(player.name);
    this.playerManager.emitToPlayer(player.name, ServerEventName.CharacterPatch, patch);
  }

  public sendClientUpdateForPlayer(player: Player) {
    this.playerManager.updatePlayer(player, PlayerChannelOperation.SpecificUpdate);
  }

  public doStartingPlayerStuff(player: Player) {
    const messageData: IAdventureLog = {
      when: Date.now(),
      type: AdventureLogEventType.Meta,
      message: `Welcome to IdleLands! Please check out your choices tab to get a sampling of what sort of things you'll encounter.
      Hit the link attached to this message to view the FAQ / New Player Guide to answer some of your questions!`,
      link: 'https://help.idle.land'
    };

    this.subscriptionManager.emitToChannel(Channel.PlayerAdventureLog, { playerNames: [player.name], data: messageData });

    this.eventManager.doEventFor(player, EventName.FindItem);

    player.emit(ServerEventName.CharacterFirstTime, {});
  }
}
