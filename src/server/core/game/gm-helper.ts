import { AutoWired, Singleton, Inject } from 'typescript-ioc';
import { DatabaseManager } from './database-manager';
import { SubscriptionManager } from './subscription-manager';
import { GameSettings, Player } from '../../../shared/models';
import { Channel, ModerationAction, PlayerChannelOperation, IFestival } from '../../../shared/interfaces';
import { ChatHelper } from './chat-helper';
import { PlayerManager } from './player-manager';
import { FestivalManager } from './festival-manager';

@Singleton
@AutoWired
export class GMHelper {

  @Inject private db: DatabaseManager;
  @Inject private chat: ChatHelper;
  @Inject private festivalManager: FestivalManager;
  @Inject private playerManager: PlayerManager;
  @Inject private subscriptionManager: SubscriptionManager;

  private settings: GameSettings;

  async init() {
    this.settings = await this.db.loadSettings();
    if(!this.settings) {
      this.settings = new GameSettings();
      this.save();
    }

    this.settings.init();
    this.subscribeToSettingsChanges();
  }

  private subscribeToSettingsChanges() {
    this.subscriptionManager.subscribeToChannel(Channel.GameSettings, ({ operation, args }) => {
      switch(operation) {
        case ModerationAction.SetMOTD: {
          this.setMOTD(args);
          break;
        }

        case ModerationAction.ChangeModTier: {
          this.changeModTier(args);
          break;
        }

        case ModerationAction.StartFestival: {
          break;
        }

        case ModerationAction.ToggleMute: {
          this.mute(args);
          break;
        }
      }
    });
  }

  // motd
  public initiateSetMOTD(newMOTD: string) {
    newMOTD = newMOTD || '';

    if(newMOTD) {
      this.chat.sendMessageFromClient({
        message: newMOTD,
        playerName: '☆System'
      });
    }

    this.subscriptionManager.emitToChannel(Channel.GameSettings, {
      operation: ModerationAction.SetMOTD, args: { newMOTD }
    });
  }

  private setMOTD({ newMOTD }) {
    this.settings.motd = newMOTD;
    this.save();
  }

  // mute
  public initiateMute(playerName: string, duration: number) {
    this.subscriptionManager.emitToChannel(Channel.GameSettings, {
      operation: ModerationAction.ToggleMute, args: { playerName, duration }
    });
  }

  public mute({ playerName, duration }) {
    const player = this.playerManager.getPlayer(playerName);
    if(!player) return;

    // unmute
    if(duration < 0) {
      player.mutedUntil = 0;
      player.messageCooldown = 0;

    // mute extension
    } else if(player.mutedUntil) {
      player.mutedUntil += (1000 * 60 * duration);

    // vanilla mute
    } else {
      player.mutedUntil = Date.now() + (1000 * 60 * duration);

    }

    this.playerManager.updatePlayer(player, PlayerChannelOperation.SpecificUpdate);
  }

  // change mod tier
  public initiateChangeModTier(playerName: string, newTier: number) {

    this.subscriptionManager.emitToChannel(Channel.GameSettings, {
      operation: ModerationAction.ChangeModTier, args: { playerName, newTier }
    });
  }

  private changeModTier({ playerName, newTier }) {
    const player = this.playerManager.getPlayer(playerName);
    if(!player) return;

    player.modTier = newTier;
    this.playerManager.updatePlayer(player, PlayerChannelOperation.SpecificUpdate);
  }

  // create festival
  public createFestival(player: Player, festival: IFestival) {
    this.festivalManager.startGMFestival(player, festival);
  }

  private save() {
    this.db.saveSettings(this.settings);
  }
}
