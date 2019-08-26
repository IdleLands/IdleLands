import { AutoWired, Singleton, Inject } from 'typescript-ioc';
import { DatabaseManager } from './database-manager';
import { Festivals } from '../../../shared/models/entity';
import { IFestival, Stat, Channel, FestivalChannelOperation } from '../../../shared/interfaces';
import { RNGService } from './rng-service';
import { Player } from '../../../shared/models';
import { ChatHelper } from './chat-helper';
import { SubscriptionManager } from './subscription-manager';
import { PlayerManager } from './player-manager';

@Singleton
@AutoWired
export class FestivalManager {

  @Inject private db: DatabaseManager;
  @Inject private playerManager: PlayerManager;
  @Inject private subscriptionManager: SubscriptionManager;
  @Inject private chat: ChatHelper;
  @Inject private rng: RNGService;

  private festivals: Festivals;

  async init() {
    this.festivals = await this.db.loadFestivals();
    if(!this.festivals) {
      this.festivals = new Festivals();
      this.save();
    }

    this.festivals.init();
    this.subscribeToFestivalChanges();
  }

  public tick() {
    this.festivals.festivals.forEach(festival => {
      if(this.isValidFestival(festival)) return;
      this.initateRemoveFestival(festival);
    });
  }

  // we store them as integers now, instead of decimals. so 300% isn't stored as 3, it's stored as 300.
  public getMultiplier(stat: Stat) {
    return this.festivals.festivals.reduce((prev, cur) => prev += cur.stats[stat] || 0, 0) / 100;
  }

  public isValidFestival(festival: IFestival): boolean {
    return festival.endTime > Date.now();
  }

  private makeSystemFestival(festival: IFestival): IFestival {
    festival.startedBy = `☆${festival.startedBy}`;
    return festival;
  }

  public startAscensionFestival(player: Player) {

    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 3);

    const festival = this.makeSystemFestival({
      name: `${player.name}'s ${player.ascensionLevel}★ Ascension`,
      startedBy: player.name,
      endTime: endTime.getTime(),
      stats: {
        [Stat.XP]: player.ascensionLevel,
        [Stat.GOLD]: player.ascensionLevel
      }
    });

    this.initiateAddFestival(festival);

    this.chat.sendMessageFromClient({
      message: `A new festival "${festival.name}" has started!`,
      playerName: '☆System'
    });
  }

  public startGMFestival(player: Player, festival: IFestival) {

    const addedFestival = this.makeSystemFestival(festival);

    this.initiateAddFestival(addedFestival);

    const statString = Object.keys(festival.stats)
      .map(x => `${x.toUpperCase()} +${festival.stats[x]}%`)
      .join(', ');

    this.chat.sendMessageFromClient({
      message: `A new festival "${addedFestival.name}" has started! Stat Boosts: ${statString}`,
      playerName: `☆${player.name}`
    });
  }

  public startFestival(player: Player, festival: IFestival) {
    this.initiateAddFestival(festival);

    this.chat.sendMessageFromClient({
      message: `A new festival "${festival.name}" has started!`,
      playerName: '☆System'
    });
  }

  private subscribeToFestivalChanges() {
    this.subscriptionManager.subscribeToChannel(Channel.Festivals, ({ festival, operation }) => {
      switch(operation) {
        case FestivalChannelOperation.Add: {
          this.addFestival(festival);
          break;
        }
        case FestivalChannelOperation.Remove: {
          this.removeFestival(festival);
          break;
        }
      }
    });
  }

  public hasFestivalForName(name: string): boolean {
    return this.festivals.festivals.some(fest => fest.startedBy === name);
  }

  public hasFestivalWithName(festival: string): boolean {
    return this.festivals.festivals.some(fest => fest.name === festival);
  }

  public initiateAddFestival(festival: IFestival): boolean {
    if(!festival.id) festival.id = this.rng.id();

    // only do this for ILP-created festivals
    // if(this.festivals.festivals.some(fest => fest.startedBy === festival.startedBy && !festival.startedBy.includes('☆'))) return false;

    this.subscriptionManager.emitToChannel(Channel.Festivals, { festival, operation: FestivalChannelOperation.Add });

    return true;
  }

  public initateRemoveFestival(festival: IFestival) {
    this.subscriptionManager.emitToChannel(Channel.Festivals, { festival, operation: FestivalChannelOperation.Remove });
  }

  private addFestival(festival: IFestival) {
    this.festivals.addFestival(festival);
    this.save();

    this.playerManager.allPlayers.forEach(player => player.recalculateStats());
  }

  public removeFestival(festival: IFestival) {
    this.festivals.removeFestival(festival.id);
    this.save();

    this.playerManager.allPlayers.forEach(player => player.recalculateStats());
  }

  private save() {
    this.db.saveFestivals(this.festivals);
  }
}
