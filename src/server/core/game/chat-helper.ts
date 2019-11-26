import { Singleton, AutoWired, Inject } from 'typescript-ioc';

import { IMessage, Channel } from '../../../shared/interfaces';
import { SubscriptionManager } from './subscription-manager';
import { censorSensor } from '../static/profanity-filter';

@Singleton
@AutoWired
export class ChatHelper {

  @Inject private subscriptionManager: SubscriptionManager;

  private onMessageCallback = (msg: string) => { };

  private sortMessage(message: IMessage) {
    if(!message.timestamp) message.timestamp = Date.now();
  }

  public async init(onMessageCallback) {
    this.onMessageCallback = onMessageCallback;
  }

  public sendMessageFromClient(message: IMessage) {
    this.sortMessage(message);
    message.message = censorSensor.cleanProfanity(message.message);

    this.sendMessageToDiscord(message);
    this.sendMessageToGame(message);
  }

  public sendMessageToGame(message: IMessage) {
    this.sortMessage(message);
    this.subscriptionManager.emitToClients(Channel.PlayerChat, { message });
  }

  public sendMessageToDiscord(message: IMessage) {
    this.sortMessage(message);
    if(!message.playerLevel && !message.playerAscension) {
      this.onMessageCallback(`<${message.playerName}> ${message.message}`);
      return;
    }

    const levelString = `${message.playerAscension || 0}★${message.playerLevel}`;
    const guildString = message.guildTag ? `[${message.guildTag}] ` : '';
    this.onMessageCallback(`<${message.playerName} ${guildString}${levelString}> ${message.message}`);
  }

}
