import { AutoWired, Singleton, Inject } from 'typescript-ioc';
import { IParty, IPlayer } from '../../../shared/interfaces';
import { AssetManager } from './asset-manager';
import { PartyManager } from './party-manager';
import { PlayerManager } from './player-manager';

@Singleton
@AutoWired
export class PartyHelper {

  @Inject private assetManager: AssetManager;
  @Inject private playerManager: PlayerManager;
  @Inject private partyManager: PartyManager;

  public generateName(): string {
    return this.assetManager.party();
  }

  public teleportNear(player: IPlayer, target: IPlayer): void {
    player.x = target.x;
    player.y = target.y;
    player.map = target.map;
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

    console.log(party.members[0], player.name);
    if(party.members[0] !== player.name && player.$personalities.has('Telesheep')) {
      const leader = this.playerManager.getPlayer(party.members[0]);
      player.setPos(leader.x, leader.y, leader.map, leader.region);
    }
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

  public getPartyLeader(party: IParty): IPlayer {
    return this.playerManager.getPlayer(party.members[0]);
  }
}
