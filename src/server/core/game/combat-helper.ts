
import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { sample, clone } from 'lodash';
import { compress } from 'lzutf8';

import { Player } from '../../../shared/models';
import { CombatSimulator, CombatAction } from '../../../shared/combat/combat-simulator';
import { ICombat, ICombatCharacter, Profession, ItemSlot, Stat } from '../../../shared/interfaces';
import { AssetManager } from './asset-manager';
import { PlayerManager } from './player-manager';
import { ItemGenerator } from './item-generator';

import * as Affinities from './affinities';
import * as Professions from './professions';

@Singleton
@AutoWired
export class CombatHelper {

  @Inject private assets: AssetManager;
  @Inject private itemGenerator: ItemGenerator;
  @Inject private playerManager: PlayerManager;

  createAndRunCombat(player: Player): ICombat {

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
    for(let i = 0; i < playerParty.length; i++) {
      const monster = this.createBattleMonster(averagePartyLevel);
      monster.combatId = currentId;
      monster.combatPartyId = 1;

      characters[currentId] = monster;
      currentId++;
    }

    const combat: ICombat = {
      timestamp: Date.now(),
      seed: Date.now(),
      name: this.assets.battle(),
      characters,
      parties
    };

    const simulator = new CombatSimulator(combat);
    simulator.events$.subscribe(({ action, data }) => {
      if(action === CombatAction.Victory) {
        if(data.wasTie) return;
        this.handleRewards(data.combat, data.winningParty);
      }
    });

    simulator.beginCombat();

    return combat;
  }

  private getAllPartyMembers(player: Player): ICombatCharacter[] {
    const players = player.$party ? player.$party.members.map(x => this.playerManager.getPlayer(x)) : [player];
    return players.map(partyPlayer => this.createCombatCharacter(partyPlayer));
  }

  private createBattleMonster(generateLevel: number): ICombatCharacter {
    let monsterBase = sample(
      this.assets.allObjectAssets.monster
        .filter(x => x.level >= generateLevel - 25 && x.level <= generateLevel + 25)
    );

    if(!monsterBase) {
      const monsterProfession = sample(Object.values(Profession));

      monsterBase = {
        name: `Vector ${monsterProfession}`,
        profession: monsterProfession,
        level: generateLevel,
        stats: {}
      };
    }

    const items = [
      ItemSlot.Body, ItemSlot.Charm, ItemSlot.Feet, ItemSlot.Finger, ItemSlot.Hands,
      ItemSlot.Head, ItemSlot.Legs, ItemSlot.Mainhand, ItemSlot.Neck, ItemSlot.Offhand
    ].map(itemSlot => {
      return this.itemGenerator.generateItem({
        generateLevel,
        forceType: itemSlot
      });
    });

    const professionInstance = Professions[monsterBase.profession] ? new Professions[monsterBase.profession]() : null;
    const affinityInstance = Affinities[monsterBase.attribute] ? new Affinities[monsterBase.attribute]() : null;

    Object.values(Stat).forEach(stat => {
      monsterBase.stats[stat] = monsterBase.stats[stat] || 0;

      // item boosts
      items.forEach(item => {
        if(!item) return;

        monsterBase.stats[stat] += (item.stats[stat] || 0);
      });

      // profession boost
      const profBasePerLevel = professionInstance ? professionInstance.calcLevelStat(this, stat) : 0;
      monsterBase.stats[stat] += profBasePerLevel || 0;

      // affinity boost
      const affBasePerLevel = affinityInstance ? affinityInstance.calcLevelStat(this, stat) : 0;
      monsterBase.stats[stat] += affBasePerLevel || 0;

      // stat multiplier from profession
      const statBase = monsterBase.stats[stat];

      const profMult = professionInstance ? professionInstance.calcStatMultiplier(stat) : 1;
      if(profMult > 1) {
        const addedValue = Math.floor((statBase * profMult)) - statBase;
        monsterBase.stats[stat] += addedValue || 0;
      } else if(profMult < 1) {
        const lostValue = statBase - Math.floor(statBase * profMult);
        monsterBase.stats[stat] -= lostValue || 0;
      }
    });

    // next we do specific-adds from the profession
    // we do these last, despite being additive, because they rely heavily on the stats from before
    const copyStats = clone(monsterBase.stats);
    Object.values(Stat).forEach(checkStat => {
      const profBoosts = professionInstance ? professionInstance.calcStatsForStats(copyStats, checkStat) : [];
      profBoosts.forEach(({ stat, boost }) => {
        monsterBase.stats[stat] += boost || 0;
      });
    });

    // monsters get a free hp boost b/c I said so
    monsterBase.stats[Stat.HP] = Math.max(1, monsterBase.stats[Stat.HP]);
    monsterBase.stats[Stat.HP] += (monsterBase.level * 100);

    return monsterBase;
  }

  private createCombatCharacter(player: Player): ICombatCharacter {
    return {
      name: player.fullName(),
      level: player.level.total,
      stats: Object.assign({}, player.currentStats),
      profession: player.profession
    };
  }

  private handleRewards(combat: ICombat, winningParty: number) {
    // TODO: each winning player or pet earns x% of the pot (split evenly for party)
    //       pot size: everyone puts in 5% of their current XP (minimum of 1)
    //       each player also puts in 1% of their gold, split evenly
    //       this information should probably be stored on the combat (ante: { combatid: { gold, xp } } and collected before combat so it can be shown)
    //       show how much each combatant puts in for xp and gold (important)

    // give everyone else injuries if they're players
  }

  public getCompressedCombat(combat: ICombat): string {
    const data: ICombat = JSON.parse(JSON.stringify(combat));

    delete data.chance;
    Object.values(data.characters).forEach(char => delete char.effects);

    return compress(JSON.stringify(data), { outputEncoding: 'Base64' });
  }

}
