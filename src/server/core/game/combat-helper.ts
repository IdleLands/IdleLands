
import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { sample, clone, cloneDeep, pull } from 'lodash';
import { compress } from 'lzutf8';

import { Player } from '../../../shared/models';
import { CombatSimulator, CombatAction } from '../../../shared/combat/combat-simulator';
import { ICombat, ICombatCharacter, Profession, ItemSlot, Stat, IBuff, PetUpgrade,
  ItemClass, PetAffinity, IPet, EventName } from '../../../shared/interfaces';
import { AssetManager } from './asset-manager';
import { PlayerManager } from './player-manager';
import { ItemGenerator } from './item-generator';
import { CalculatorHelper } from './calculator-helper';

import * as Affinities from './affinities';
import * as Professions from './professions';
import { Pet } from '../../../shared/models/Pet';
import { RNGService } from './rng-service';

@Singleton
@AutoWired
export class CombatHelper {

  @Inject private assets: AssetManager;
  @Inject private itemGenerator: ItemGenerator;
  @Inject private playerManager: PlayerManager;
  @Inject private rng: RNGService;
  @Inject private calculatorHelper: CalculatorHelper;

  canDoCombat(player: Player): boolean {
    const players = player.$party ? player.$party.members.map(x => this.playerManager.getPlayer(x)) : [player];
    return !players.some(
      (checkPlayer) => checkPlayer && checkPlayer.injuryCount() > checkPlayer.$statistics.get('Game/Premium/Upgrade/InjuryThreshold')
    );
  }

  createAndRunMonsterCombat(player: Player): ICombat {

    // if no party, just make a random name for this single person
    const characters = {};
    const parties = {};
    const ante = {};

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

    const playerPartyPlayers = this.getAllPlayerPartyMembers(player);
    const antes = this.getPlayerAntes(playerPartyPlayers);

    const playerParty = this.getAllPartyCombatMembers(playerPartyPlayers)
      .concat(this.getAllPartyCombatPets(playerPartyPlayers));

    playerParty.forEach(combatPlayer => {
      combatPlayer.combatId = currentId;
      combatPlayer.combatPartyId = 0;
      characters[currentId] = combatPlayer;
      ante[currentId] = antes[combatPlayer.realName] || { xp: 0, gold: 0 };
      currentId++;
    });

    const monsters = [];

    // generate monsters to fight against (each player gets one for their level)
    for(let i = 0; i < playerParty.length; i++) {
      const monster = this.createBattleMonster(playerParty[i].level);
      monster.combatId = currentId;
      monster.combatPartyId = 1;
      monsters.push(monster);

      characters[currentId] = monster;
      currentId++;
    }

    const monsterAntes = this.getGenericAntes(monsters);
    Object.assign(ante, monsterAntes);

    const doCombat: ICombat = {
      timestamp: Date.now(),
      seed: Date.now(),
      name: this.assets.battle(),
      characters,
      parties,
      ante
    };

    const { combat, simulator } = this.startCombat(doCombat);
    simulator.beginCombat();
    return combat;
  }

  createAndRunBossCombat(player: Player, opts: any = { bossName: '', bossParty: '' }): ICombat {

    // if no party, just make a random name for this single person
    const characters = {};
    const parties = {};
    const ante: any = {};

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

    const playerPartyPlayers = this.getAllPlayerPartyMembers(player);
    const antes = this.getPlayerAntes(playerPartyPlayers);

    const playerParty = this.getAllPartyCombatMembers(playerPartyPlayers)
      .concat(this.getAllPartyCombatPets(playerPartyPlayers));

    playerParty.forEach(combatPlayer => {
      combatPlayer.combatId = currentId;
      combatPlayer.combatPartyId = 0;
      characters[currentId] = combatPlayer;
      ante[currentId] = antes[combatPlayer.realName] || { xp: 0, gold: 0 };
      currentId++;
    });

    const allAssets = this.assets.allBossAssets;
    const bossMonsterPrototypes = opts.bossParty
      ? allAssets.parties[opts.bossParty].members.map(x => allAssets.creatures[x])
      : [allAssets.creatures[opts.bossName]];
    const monsters = [];

    // generate monsters to fight against (each player gets one for their level)
    bossMonsterPrototypes.forEach(proto => {
      const monster = this.createBossMonster(proto);
      monster.combatId = currentId;
      monster.combatPartyId = 1;
      monsters.push(monster);

      characters[currentId] = monster;
      currentId++;
    });

    const monsterAntes = this.getGenericAntes(monsters);
    Object.assign(ante, monsterAntes);

    const { collectibles, items } = this.getBossAntes(bossMonsterPrototypes);
    ante[currentId - 1].collectibles = collectibles;
    ante[currentId - 1].items = items;

    const doCombat: ICombat = {
      timestamp: Date.now(),
      seed: Date.now(),
      name: this.assets.battle(),
      characters,
      parties,
      ante
    };

    const { combat, simulator } = this.startCombat(doCombat);

    simulator.events$.subscribe(({ action, data }) => {
      if(action === CombatAction.Victory) {
        if(data.wasTie || data.winningParty !== 0) {

          // 5min cool down even if they lose or tie.
          player.cooldowns[opts.bossParty || opts.bossName] = Date.now() + (60 * 1000 * 5);
          return;
        }

        const respawn = opts.bossParty
          ? allAssets.parties[opts.bossParty].respawn
          : allAssets.creatures[opts.bossName].respawn;

        player.cooldowns[opts.bossParty || opts.bossName] = Date.now() + (respawn * 1000);

        Object.values(combat.characters)
          .filter(char => char.combatPartyId === 0)
          .forEach(char => {

            const playerRef = this.playerManager.getPlayer(char.realName);
            if(!playerRef) return;

            Object.values(combat.characters)
              .filter(potBoss => potBoss.combatPartyId !== 0)
              .forEach(potBoss => {
                playerRef.increaseStatistic(`BossKill/Total`, 1);
                playerRef.increaseStatistic(`BossKill/Boss/${potBoss.name}`, 1);
              });
          });
      }
    });

    simulator.beginCombat();
    return combat;
  }

  createAndRunPvPCombat(player: Player, targeted: Player): ICombat {

    // if no party, just make a random name for this single person
    const characters = {};
    const parties = {};
    const ante = {};

    // player party
    if(player.$party) {
      parties[0] = { id: 0, name: player.$party.name };
    } else {
      parties[0] = { id: 0, name: this.assets.party() };
    }

    if(targeted.$party) {
      parties[1] = { id: 1, name: targeted.$party.name };
    } else {
      parties[1] = { id: 1, name: this.assets.party() };
    }

    // give players ids
    let currentId = 0;

    // first party
    const playerPartyPlayers = this.getAllPlayerPartyMembers(player);
    const antes = this.getPlayerAntes(playerPartyPlayers);

    const playerParty = this.getAllPartyCombatMembers(playerPartyPlayers)
      .concat(this.getAllPartyCombatPets(playerPartyPlayers));
    playerParty.forEach(combatPlayer => {
      combatPlayer.combatId = currentId;
      combatPlayer.combatPartyId = 0;
      characters[currentId] = combatPlayer;
      ante[currentId] = antes[combatPlayer.realName] || { xp: 0, gold: 0 };
      currentId++;
    });

    // second party
    const playerParty2Players = this.getAllPlayerPartyMembers(targeted);
    const antes2 = this.getPlayerAntes(playerParty2Players);

    const playerParty2 = this.getAllPartyCombatMembers(playerParty2Players)
      .concat(this.getAllPartyCombatPets(playerParty2Players));
    playerParty2.forEach(combatPlayer => {
      combatPlayer.combatId = currentId;
      combatPlayer.combatPartyId = 1;
      characters[currentId] = combatPlayer;
      ante[currentId] = antes2[combatPlayer.realName] || { xp: 0, gold: 0 };
      currentId++;
    });

    const doCombat: ICombat = {
      timestamp: Date.now(),
      seed: Date.now(),
      name: this.assets.battle(),
      characters,
      parties,
      ante
    };

    const { combat, simulator } = this.startCombat(doCombat);
    simulator.beginCombat();
    return combat;
  }

  private startCombat(combat: ICombat): { combat: ICombat, simulator: CombatSimulator } {
    const simulator = new CombatSimulator(combat);
    simulator.events$.subscribe(({ action, data }) => {
      if(action === CombatAction.Victory) {
        if(data.wasTie) return;
        this.handleRewards(data.combat, data.winningParty);
      }

      if(action === CombatAction.IncrementStatistic) {
        const { statistic, value, name } = data;

        const playerRef = this.playerManager.getPlayer(name);
        if(!playerRef) return;

        if(isNaN(value) || !isFinite(value)) return;

        playerRef.increaseStatistic(statistic, value);
      }
    });

    return { combat, simulator };
  }

  private getAllPlayerPartyMembers(player: Player): Player[] {
    return player.$party ? player.$party.members.map(x => this.playerManager.getPlayer(x)) : [player];
  }

  private getPlayerAntes(players: Player[]): { [name: string]: { gold: number, xp: number } } {
    return players.reduce((prev, cur) => {
      prev[cur.name] = {
        gold: Math.floor(cur.gold * 0.01),
        xp: Math.floor(cur.xp.total * 0.05)
      };

      return prev;
    }, {});
  }

  private getGenericAntes(combatChars: ICombatCharacter[]): { [id: string]: { gold: number, xp: number } } {
    return combatChars.reduce((prev, cur) => {
      prev[cur.combatId] = {
        gold: Math.max(cur.level * 1000, Math.floor(cur.stats[Stat.GOLD])),
        xp: Math.floor(this.calculatorHelper.calcLevelMaxXP(cur.level) * 0.05)
      };
      return prev;
    }, {});
  }

  private getBossAntes(bossPrototypes: any[]): { collectibles: string[], items: string[] } {
    const collectibles = [];
    const items = [];

    bossPrototypes.forEach(proto => {
      if(proto.items) {
        proto.items.forEach(item => {
          if(!this.rng.likelihood(item.dropPercent)) return;
          items.push(item.name);
        });
      }

      if(proto.collectibles) {
        proto.collectibles.forEach(coll => {
          if(!this.rng.likelihood(coll.dropPercent)) return;
          collectibles.push(coll.name);
        });
      }
    });

    return { collectibles, items };
  }

  private getAllPartyCombatMembers(players: Player[]): ICombatCharacter[] {
    return players.map(partyPlayer => this.createCombatCharacter(partyPlayer));
  }

  private getAllPartyCombatPets(players: Player[]): ICombatCharacter[] {
    const basePets = players.map(player => {
      if(!this.rng.likelihood(player.$pets.getCurrentValueForUpgrade(PetUpgrade.BattleJoinPercent))) return;

      const pet = player.$pets.$activePet;
      const petC = this.createCombatPet(pet);
      petC.ownerName = player.name;
      return petC;
    }).filter(Boolean);

    const extraPets = players.reduce((prev, player) => {
      const extraCount = player.$statistics.get('Game/Premium/Upgrade/MaxPetsInCombat');
      if(extraCount <= 1) return prev;

      if(player.profession === 'Necromancer') {
        const necroPets = [];

        for(let i = 0; i < extraCount - 1; i++) {
          necroPets.push(this.createNecroPet(player));
        }

        return prev.concat(necroPets);
      }

      const newPets = [];

      const possiblePets = Object.values(player.$petsData.allPets)
        .filter((x: IPet) => x !== player.$pets.$activePet && x.affinity !== PetAffinity.None);

      for(let i = 0; i < extraCount - 1; i++) {
        const pet = sample(possiblePets);
        if(!pet) return prev.concat(newPets);

        pull(possiblePets, pet);
        newPets.push(this.createCombatPet(pet as Pet));
      }

      return prev.concat(newPets);
    }, []);

    return basePets.concat(extraPets);
  }

  private getMonsterProto(generateLevel: number): any {
    let monsterBase = cloneDeep(sample(
      this.assets.allObjectAssets.monster
        .filter(x => x.level >= generateLevel - 25 && x.level <= generateLevel + 25)
    ));

    if(!monsterBase) {
      const monsterProfession = sample(Object.values(Profession));

      monsterBase = {
        name: `Vector ${monsterProfession}`,
        profession: monsterProfession,
        level: generateLevel,
        stats: {}
      };
    }

    return monsterBase;
  }

  private createBossMonster(proto: any): ICombatCharacter {
    const base = cloneDeep(proto);
    base.attributes.name = base.name;
    return this.equipBattleMonster(base.attributes, base.availableScore);
  }

  private createBattleMonster(generateLevel: number): ICombatCharacter {
    const monsterBase = this.getMonsterProto(generateLevel);

    return this.equipBattleMonster(monsterBase);
  }

  private equipBattleMonster(monsterBase: any, maxScore?: number): ICombatCharacter {

    // fix class snafu nonsense
    if(monsterBase.profession === 'Random') monsterBase.profession = sample(Object.values(Profession));
    if(!monsterBase.profession) {
      monsterBase.profession = sample(['Monster', 'MagicalMonster']);
    }

    let curScore = 0;

    // generate equipment
    const items = [
      ItemSlot.Body, ItemSlot.Charm, ItemSlot.Feet, ItemSlot.Finger, ItemSlot.Hands,
      ItemSlot.Head, ItemSlot.Legs, ItemSlot.Mainhand, ItemSlot.Neck, ItemSlot.Offhand
    ].map(itemSlot => {
      const item = this.itemGenerator.generateItem({
        generateLevel: monsterBase.level,
        forceType: itemSlot
      });

      if(!item) return null;

      if(maxScore && item.score + curScore > maxScore) return null;
      curScore += item.score;

      return item;
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

    Object.keys(monsterBase.stats).forEach(statKey => {
      monsterBase.stats[statKey] = Math.max(monsterBase.stats[statKey], 10);
    });

    monsterBase.maxStats = clone(monsterBase.stats);

    return monsterBase;
  }

  private createCombatCharacter(player: Player): ICombatCharacter {

    const stats = clone(player.currentStats);
    const maxStats = clone(player.currentStats);

    stats[Stat.SPECIAL] = player.$profession.determineStartingSpecial(player);
    maxStats[Stat.SPECIAL] = player.$profession.determineMaxSpecial(player);

    return {
      name: player.fullName(),
      realName: player.name,
      level: player.level.total,
      specialName: player.$profession.specialStatName,
      maxStats,
      stats,
      profession: player.profession
    };
  }

  private createCombatPet(pet: Pet): ICombatCharacter {
    const stats = clone(pet.currentStats);
    const maxStats = clone(pet.currentStats);

    return {
      name: `${pet.name} (${pet.$$player.name}'s Pet)`,
      level: pet.level.total,
      stats,
      maxStats,
      affinity: pet.affinity,
      attribute: pet.attribute,
      rating: pet.rating
    };
  }

  private createNecroPet(player: Player): ICombatCharacter {

    const multiplier = 0.75;

    const stats = Object.assign({}, player.currentStats);
    Object.keys(stats).forEach(stat => stats[stat] = Math.floor(stats[stat] * multiplier));

    const maxStats = Object.assign({}, stats);

    const profession = sample(Object.values(Profession));
    const prefix = sample(['Zombie', 'Skeletal', 'Bone', 'Ghostly', 'Mummy', 'Ghoulish', 'Spectral', 'Shadow']);

    return {
      name: `${prefix} ${profession} (${player.name}'s Minion)`,
      level: Math.floor(player.level.total * multiplier),
      stats,
      maxStats,
      profession
    };
  }

  private handleRewards(combat: ICombat, winningParty: number) {
    const winningPlayers = Object.values(combat.characters)
      .filter(x => x.combatPartyId === winningParty)
      .map(x => this.playerManager.getPlayer(x.realName))
      .filter(Boolean);

    const winningPets = Object.values(combat.characters)
      .filter(x => x.combatPartyId === winningParty)
      .map(x => {
        const player = this.playerManager.getPlayer(x.ownerName);
        if(!player) return;

        return player.$pets.$activePet;
      })
      .filter(Boolean);

    // remove winner ante so they don't cash in hard or lose too hard
    Object.values(combat.characters).filter(x => x.combatPartyId === winningParty).forEach(char => delete combat.ante[char.combatId]);
    const totalXPAnte = Object.values(combat.ante).reduce((prev, cur) => prev + cur.xp, 0);
    const totalGoldAnte = Object.values(combat.ante).reduce((prev, cur) => prev + cur.gold, 0);

    const anteItems = Object.values(combat.ante).reduce((prev, cur) => prev.concat(cur.items || []), []);
    const anteCollectibles = Object.values(combat.ante).reduce((prev, cur) => prev.concat(cur.collectibles || []), []);

    const { items, collectibles } = this.assets.allBossAssets;

    const earnedGold = Math.floor(totalGoldAnte / winningPlayers.length);
    const earnedXP = Math.floor(totalXPAnte / winningPlayers.length);

    winningPets.forEach((pet) => {
      pet.gainGold(earnedGold);
      pet.gainXP(earnedXP);
    });

    // split rewards evenly amongst the winners
    winningPlayers.forEach((char) => {

      char.gainGold(earnedGold);
      char.gainXP(earnedXP);

      if(anteItems.length > 0) {
        anteItems.forEach(itemName => {
          const foundItem = this.itemGenerator.generateGuardianItem(char, items[itemName]);
          char.$$game.eventManager.doEventFor(char, EventName.FindItem, { fromGuardian: true, item: foundItem });
        });
      }

      if(anteCollectibles.length > 0) {
        anteCollectibles.forEach(collName => {
          const coll = collectibles[collName];

          char.tryFindCollectible({
            name: collName,
            rarity: ItemClass.Guardian,
            description: coll.flavorText,
            storyline: coll.storyline
          });
        });
      }
    });

    // assign penalties
    Object.values(combat.characters).forEach(x => {
      if(x.combatPartyId === winningParty) return;

      const player = this.playerManager.getPlayer(x.realName);
      if(!player) return;

      const ante = combat.ante[x.combatId];
      if(!ante) return;

      player.spendGold(ante.gold);
      player.gainXP(-ante.xp);

      player.addBuff(this.createRandomInjury(player));

    });

  }

  public getCompressedCombat(combat: ICombat): string {
    const data: ICombat = JSON.parse(JSON.stringify(combat));

    delete data.chance;
    Object.values(data.characters).forEach(char => delete char.effects);

    return compress(JSON.stringify(data), { outputEncoding: 'Base64' });
  }

  private createRandomInjury(player: Player): IBuff {
    const injuryName = this.assets.injury();
    const debuffStat = sample([Stat.STR, Stat.INT, Stat.LUK, Stat.CON, Stat.DEX, Stat.HP, Stat.AGI]);
    const debuffValue = Math.floor(player.getStat(debuffStat) * 0.05);

    return {
      name: injuryName,
      statistic: 'Character/Ticks',
      duration: 180,
      stats: { [debuffStat]: -debuffValue }
    };
  }

}
