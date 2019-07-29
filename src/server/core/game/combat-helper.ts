
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

    // if no party, just make a random name for this single person
    const characters = {};
    const parties = {};

    // player party
    if(player.$party) {
      parties[0] = { id: 0, name: player.$party.name };
    } else {
      parties[0] = { id: 0, name: this.assets.party() };
    }

    // monster party
    parties[1] = { id: 1, name: this.assets.party() };

    // give players ids
    let currentId = 0;

    const playerParty = this.getAllPartyMembers(player);
    playerParty.forEach(combatPlayer => {
      combatPlayer.combatId = currentId;
      combatPlayer.combatPartyId = 0;
      characters[currentId] = combatPlayer;
      currentId++;
    });

    // figure out the average party level for monster generation
    const averagePartyLevel = Math.floor(playerParty.reduce((prev, cur) => prev + cur.level, 0) / playerParty.length);

    // generate monsters to fight against
    const monsters = [];
    for(let i = 0; i < playerParty.length; i++) {
      const monster = this.createCombatMonster(averagePartyLevel);
      monster.combatId = currentId;
      monster.combatPartyId = 1;

      monsters.push(monster);
      currentId++;
    }

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

  private createCombatMonster(level: number): ICombatCharacter {
    return this.assets.createBattleMonster(level);
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
