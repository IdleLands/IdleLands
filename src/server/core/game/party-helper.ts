import { AutoWired, Singleton, Inject } from 'typescript-ioc';
import { IParty, IPlayer } from '../../../shared/interfaces';
import { RNGService } from './rng-service';
import { SubscriptionManager } from './subscription-manager';
import { AssetManager } from './asset-manager';
import { PartyManager } from './party-manager';
import { PlayerManager } from './player-manager';

@Singleton
@AutoWired
export class PartyHelper {

  @Inject private rng: RNGService;
  @Inject private assetManager: AssetManager;
  @Inject private playerManager: PlayerManager;
  @Inject private partyManager: PartyManager;
  @Inject private subscriptionManager: SubscriptionManager;

  public generateName(): string {
    return this.assetManager.party();
  }

  public teleportNear(player: IPlayer, target: IPlayer): void {
    player.x = target.x;
    player.y = target.y;
    player.map = target.map;
  }

  // TODO: pets join combat; player parties made for combat shouldnt exist. only do party fights if you have a party
  public prepareForCombat(party: IParty): void {

  }

  public createParty(): IParty {
    const party: IParty = { name: '', members: [] };
    do {
      party.name = this.generateName();
    } while(this.partyManager.getParty(party.name));

    return party;
  }

  public getParty(partyName: string): IParty {
    return this.partyManager.getParty(partyName);
  }

  public shareParty(party: IParty): void {
    this.partyManager.addParty(party);
  }

  public removeParty(party: IParty): void {
    this.partyManager.removeParty(party);
  }

  // player join party
  public playerJoin(party: IParty, player: IPlayer): void {
    player.$party = party;
    party.members.push(player.name);
    player.increaseStatistic('Event/Party/Join', 1);

    // TODO: teleport near?
  }

  public playerLeave(player: IPlayer): void {
    const party = player.$party;
    if(!party) return;

    this.disband(party);
  }

  public disband(party: IParty): void {
    party.members.forEach(memberName => {
      const playerRef = this.playerManager.getPlayer(memberName);
      if(!playerRef) return;

      playerRef.increaseStatistic('Event/Party/Leave', 1);
      playerRef.$party = null;
    });

    this.removeParty(party);
  }
}
