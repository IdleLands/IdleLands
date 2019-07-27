
import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { Player } from '../../../shared/models';
import { CombatSimulator } from '../../../shared/combat/combat-simulator';
import { ICombat, ICombatCharacter, IParty } from '../../../shared/interfaces';
import { AssetManager } from './asset-manager';
import { PlayerManager } from './player-manager';

@Singleton
@AutoWired
export class CombatHelper {

  @Inject private assets: AssetManager;
  @Inject private playerManager: PlayerManager;

  createAndRunCombat(player: Player) {

    // copy party name, grab all members
    if(player.$party) {
      console.log(player.$party);
    }

    // if no party, just make a random name for this single person
    const characters = {};
    const parties = {};

    const currentPartyId = 0;
    const currentCharacterId = 0;

    // TODO: get all players, parties, assign ids, and start combat

    const playerParty = this.getAllPartyMembers(player);

    const combat: ICombat = {
      name: this.assets.battle(),
      characters,
      parties
    };

    const simulator = new CombatSimulator(combat);
    simulator.events$.subscribe(event => {
      console.log(event);
    });

    simulator.beginCombat();
  }

  private getAllPartyMembers(player: Player): ICombatCharacter[] {
    const players = player.$party ? player.$party.members.map(x => this.playerManager.getPlayer(x)) : [player];
    return players.map(partyPlayer => this.createCombatCharacter(partyPlayer));
  }

  private createCombatMonster(): ICombatCharacter {
    return null;
  }

  private createCombatCharacter(player: Player): ICombatCharacter {
    return {
      name: player.fullName(),
      level: player.level.total,
      stats: Object.assign({}, player.currentStats),
      profession: player.profession
    };
  }

  private handleRewards() {

  }

}
