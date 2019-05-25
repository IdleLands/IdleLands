import { Singleton, AutoWired, Inject } from 'typescript-ioc';

import { IMessage, Channel } from '../../../shared/interfaces';
import { SubscriptionManager } from './subscription-manager';

@Singleton
@AutoWired
export class ChatHelper {

  @Inject private subscriptionManager: SubscriptionManager;

  private onMessageCallback = (msg: string) => {};

  public async init(onMessageCallback) {
    this.onMessageCallback = onMessageCallback;
  }

  public sendMessageFromClient(message: IMessage) {
    this.sendMessageToDiscord(message);
    this.sendMessageToGame(message);
  }

  public sendMessageToGame(message: IMessage) {
    this.subscriptionManager.emitToClients(Channel.PlayerChat, { message });
  }

  public sendMessageToDiscord(message: IMessage) {
    this.onMessageCallback(`<${message.playerName} ${message.playerAscension || 0}★${message.playerLevel}> ${message.message}`);
  }

}
