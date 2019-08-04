import { Singleton, AutoWired, Inject } from 'typescript-ioc';

import { Channel, PartyChannelOperation, IParty } from '../../../shared/interfaces';
import { SubscriptionManager } from './subscription-manager';

@Singleton
@AutoWired
export class PartyManager {
  @Inject private subscriptionManager: SubscriptionManager;

  private parties: { [key: string]: IParty } = {};

  public get partyNames() {
    return Object.keys(this.parties);
  }

  public async init() {
    this.subscribeToPartyMods();
  }

  private subscribeToPartyMods() {
    this.subscriptionManager.subscribeToChannel(Channel.Party, ({ party, operation }) => {
      switch(operation) {
        case PartyChannelOperation.Add: {
          this.parties[party.name] = party;
          break;
        }
        case PartyChannelOperation.Update: {
          this.parties[party.name] = party;
          break;
        }
        case PartyChannelOperation.Remove: {
          delete this.parties[party.name];
          break;
        }
      }
    });
  }

  public getParty(partyName: string): IParty {
    return this.parties[partyName];
  }

  public addParty(party: IParty): void {
    this.subscriptionManager.emitToChannel(Channel.Party, { party, operation: PartyChannelOperation.Add });
  }

  public removeParty(party: IParty): void {
    this.subscriptionManager.emitToChannel(Channel.Party, { party, operation: PartyChannelOperation.Remove });
  }

}
