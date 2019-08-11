import { AutoWired, Singleton, Inject } from 'typescript-ioc';

import { capitalize, get } from 'lodash';

import { Player } from '../../../shared/models';
import { World, Tile } from './world';
import { Direction, MovementType } from '../../../shared/interfaces';
import { RNGService } from './rng-service';
import { EventManager } from './event-manager';
import { Logger } from '../logger';
import { HolidayHelper } from './holiday-helper';
import { EventName } from './events/Event';
import { AssetManager } from './asset-manager';
import { PartyHelper } from './party-helper';

@Singleton
@AutoWired
export class MovementHelper {

  @Inject private world: World;
  @Inject private logger: Logger;
  @Inject private rng: RNGService;
  @Inject private assets: AssetManager;
  @Inject private eventManager: EventManager;
  @Inject private partyHelper: PartyHelper;
  @Inject private holidayHelper: HolidayHelper;

  private directions: Direction[] = [
    Direction.Southwest,
    Direction.South,
    Direction.Southeast,
    Direction.East,
    Direction.Northeast,
    Direction.North,
    Direction.Northwest,
    Direction.West
  ];

  public locToTeleport(name) {
    return this.assets.allTeleports[name];
  }

  public moveToStart(player: Player): void {
    player.setPos(10, 10, 'Norkos', 'Norkos Town');
  }

  private getTileAt(map: string, x: number, y: number): Tile {
    return this.world.getMap(map).getTile(x, y);
  }

  private canEnterTile(player: Player, tile: Tile): boolean {

    const properties = get(tile, 'object.properties');

    if(properties) {
      let totalRequirements = 0;
      let metRequirements = 0;

      if(properties.requireMap) {
        totalRequirements++;
        if(player.$statistics.get(`Map/${properties.requireMap}/Steps`) > 0) metRequirements++;
      }

      if(properties.requireBoss) {
        totalRequirements++;
        if(player.$statistics.get(`BossKill/${properties.requireBoss}`) > 0) metRequirements++;
      }

      if(properties.requireClass) {
        totalRequirements++;
        if(player.profession === properties.requireClass) metRequirements++;
      }

      if(properties.requireAchievement) {
        totalRequirements++;
        if(player.hasAchievement(properties.requireAchievement)) metRequirements++;
      }

      if(properties.requireCollectible) {
        totalRequirements++;
        if(player.$collectibles.hasCurrently(properties.requireCollectible)) metRequirements++;
      }

      if(properties.requireAscension) {
        totalRequirements++;
        if(player.ascensionLevel >= +properties.requireAscension) metRequirements++;
      }

      if(properties.requireHoliday) {
        totalRequirements++;
        if(this.holidayHelper.isHoliday(properties.requireHoliday)) metRequirements++;
      }

      if(totalRequirements !== metRequirements) return false;
    }

    return !tile.blocked && tile.terrain !== 'Void';
  }

  private num2dir(dir: Direction, x: number, y: number): { x: number, y: number } {
    switch(dir) {
      case Direction.Southwest:  return { x: x - 1, y: y - 1 };
      case Direction.South:      return { x: x,     y: y - 1 };
      case Direction.Southeast:  return { x: x + 1, y: y - 1 };
      case Direction.West:       return { x: x - 1, y: y };
      case Direction.East:       return { x: x + 1, y: y };
      case Direction.Northwest:  return { x: x - 1, y: y + 1 };
      case Direction.North:      return { x: x,     y: y + 1 };
      case Direction.Northeast:  return { x: x + 1, y: y + 1 };

      default:                   return { x: x,     y: y };
    }
  }

  private xyDiff2dir(x1: number, y1: number, x2: number, y2: number): Direction {
    if(x1 > x2    && y1 > y2)   return Direction.Southwest;
    if(x1 === x2  && y1 > y2)   return Direction.South;
    if(x1 < x2    && y1 > y2)   return Direction.Southeast;

    if(x1 > x2    && y1 === y2) return Direction.West;
    if(x1 < x2    && y1 === y2) return Direction.East;

    if(x1 > x2    && y1 < y2)   return Direction.Northwest;
    if(x1 === x2  && y1 < y2)   return Direction.North;
    if(x1 < x2    && y1 < y2)   return Direction.Northeast;

    return Direction.Nowhere;
  }

  private getInitialWeight(player: Player) {

    let weight = [300, 40, 7,  3,  1,  3,  7,  40];

    const drunk = false;

    let dirMod: Direction = null;
    if(player.lastDir) {
      dirMod = player.lastDir;
    }

    if(player.divineDirection) {
      player.increaseStatistic(`Character/Movement/Steps/Divine`, 1);
      dirMod = this.xyDiff2dir(player.x, player.y, player.divineDirection.x, player.divineDirection.y);
    }

    if(dirMod) {
      const lastDirIndex = this.directions.indexOf(dirMod);
      if(lastDirIndex !== -1) {
        weight = weight.slice(weight.length - lastDirIndex).concat(weight.slice(0, weight.length - lastDirIndex));
      }
    }

    if(drunk) {
      weight = [1, 1, 1, 1, 1, 1, 1, 1];
    }

    return weight;
  }

  private pickRandomDirection(player: Player, weight: number[]): { index: number, dir: Direction } {

    const dirIndexes = [0, 1, 2, 3, 4, 5, 6, 7];
    const weights = weight;

    const useIndexes = [];
    const useWeights = [];

    for(let i = 0; i < weights.length; i++) {
      if(weights[i] === 0) continue;
      useWeights.push(weights[i]);
      useIndexes.push(dirIndexes[i]);
    }

    if(weight.length === 0 || useWeights.length === 0) {
      this.logger.error('PlayerMovement',
        new Error(`${player.name} in ${player.map} @ ${player.x},${player.y} is unable to move due to no weights.`)
      );
      return;
    }

    const dirIndex = this.rng.weighted(useIndexes, useWeights);
    return { index: dirIndex, dir: this.directions[dirIndex] };
  }

  // used externally to move the player (gm, premium, etc)
  public doTeleport(player: Player, { map, x, y, toLoc }) {
    const tile = {
      terrain: '',
      region: '',
      blocked: false,
      object: {
        properties: {
          destx: x,
          desty: y,
          movementType: 'teleport',
          map,
          toLoc
        }
      }
    };

    this.handleTileTeleport(player, tile, true);
    const realTile = this.getTileAt(player.map, player.x, player.y);
    this.handleTile(player, realTile);
  }

  private handleTile(player: Player, tile: Tile, ignoreIf?: string): void {

    const type = get(tile, 'object.properties.realtype');

    const forceEvent = get(tile, 'object.properties.forceEvent', '');
    if(forceEvent) {
      const cdCheck = `${player.x},${player.y}|${player.map}`;

      if(!player.cooldowns[cdCheck] || player.cooldowns[cdCheck] < Date.now()) {
        delete player.cooldowns[cdCheck];

        const oldil3EventNames = {
          'ItemBless': 'BlessItem',
          'ItemForsake': 'ForsakeItem',
          'GoldBless': 'BlessGold',
          'GoldForsake': 'ForsakeGold',
          'XPBless': 'BlessXP',
          'XPForsake': 'ForsakeXP',
          'Gambling': 'Gamble'
        };

        this.eventManager.doEventFor(player, oldil3EventNames[forceEvent] || forceEvent, tile.object.properties);
      }

      if(forceEvent !== EventName.Providence) {

        // 5 minute cooldown per tile
        player.cooldowns[cdCheck] = Date.now() + (1000 * 60 * 5);
      }
    }

    if(!type || !this[`handleTile${type}`] || ignoreIf === type) return;
    this[`handleTile${type}`](player, tile);
  }

  private handleTileTeleport(player: Player, tile: Tile, force = false): void {
    if(!tile.object) return;

    const dest = tile.object.properties;
    dest.x = +dest.destx;
    dest.y = +dest.desty;

    if(dest.movementType === MovementType.Ascend && player.$personalities.isActive('Delver')) return;
    if(dest.movementType === MovementType.Descend && player.$personalities.isActive('ScaredOfTheDark')) return;

    if(!force && (dest.movementType === MovementType.Ascend || dest.movementType === MovementType.Descend)) {
      if(player.stepCooldown > 0) return;
      player.stepCooldown = 10;
    }

    if(!dest.map && !dest.toLoc) {
      this.logger.error('PlayerMovement', new Error(`No dest.map at ${player.x}, ${player.y} in ${player.map}`));
      return;
    }

    if(!dest.movementType) {
      this.logger.error('PlayerMovement', new Error(`No dest.movementType at ${player.x}, ${player.y} in ${player.map}`));
      return;
    }

    if(!dest.fromName) dest.fromName = player.map;
    if(!dest.destName) dest.destName = dest.map;

    if(dest.toLoc) {
      if(dest.toLoc === 'guildbase') {
        return;

      } else {
        try {
          const toLocData = this.locToTeleport(dest.toLoc);
          dest.x = toLocData.x;
          dest.y = toLocData.y;
          dest.map = toLocData.map;
          dest.destName = toLocData.formalName;
        } catch(e) {
          this.logger.error('PlayerMovement',
            new Error(`Loc data is not correct for ${dest.toLoc} (${JSON.stringify(this.locToTeleport(dest.toLoc))})`));

          player.setPos(10, 10, 'Norkos', 'Wilderness');
          return;
        }
      }
    }

    player.setPos(dest.x, dest.y, dest.map, tile.region);

    this.handleTile(player, tile, 'Teleport');

    player.increaseStatistic(`Character/Movement/${capitalize(dest.movementType)}`, 1);
  }

  private handleTileCollectible(player: Player, tileData: any) {
    const collectible = tileData.object;
    const collectibleName = collectible.name;
    const collectibleRarity = get(collectible, 'properties.rarity', 'basic');

    player.tryFindCollectible({
      name: collectibleName,
      rarity: collectibleRarity,
      description: collectible.properties.flavorText,
      storyline: collectible.properties.storyline
    });
  }

  private handleTileTrainer(player: Player, tileData: any) {
    const professionName = tileData.object.name;
    const trainerName = tileData.object.properties.realName ?
      `${tileData.object.properties.realName}, the ${professionName} trainer` :
      `the ${professionName} trainer`;

    this.eventManager.doEventFor(player, EventName.FindTrainer, { professionName, trainerName });
  }

  private handleTileBoss(player: Player, tileData: any) {
    this.eventManager.doEventFor(player, EventName.BattleBoss, { bossName: tileData.object.name });
  }

  private handleTileBossParty(player: Player, tileData: any) {
    this.eventManager.doEventFor(player, EventName.BattleBoss, { bossParty: tileData.object.name });
  }

  private handleTileTreasure(player: Player, tileData: any) {
    this.eventManager.doEventFor(player, EventName.FindTreasure, { treasureName: tileData.object.name });
  }

  public takeStep(player: Player) {

    if(player.$personalities.isActive('Camping')) {
      player.increaseStatistic('Character/Movement/Steps/Camping', 1);
      return;
    }

    const weight = this.getInitialWeight(player);

    if(!player.stepCooldown) player.stepCooldown = 0;

    let attempts = 1;
    let { index, dir } = this.pickRandomDirection(player, weight);

    // follow the leader if we're a telesheep
    if(player.$party && player.$personalities.isActive('Telesheep')) {
      const leader = this.partyHelper.getPartyLeader(player.$party);
      if(leader !== player) {
        dir = this.xyDiff2dir(player.x, player.y, leader.x, leader.y);
      }
    }

    let newLoc = this.num2dir(dir, player.x, player.y);
    let tile = this.getTileAt(player.map, newLoc.x, newLoc.y);

    while(!this.canEnterTile(player, tile)) {
      if(attempts > 8) {
        this.logger.error('PlayerMovement',
          new Error(`Player ${player.name} is position locked at ${player.x}, ${player.y} in ${player.map}`));
        break;
      }

      weight[index] = 0;

      const res = this.pickRandomDirection(player, weight);
      index = res.index;
      dir = res.dir;
      newLoc = this.num2dir(dir, player.x, player.y);
      tile = this.getTileAt(player.map, newLoc.x, newLoc.y);

      attempts++;
    }

    if(!tile.terrain) {
      this.logger.error('PlayerMovement',
        new Error(`Invalid tile terrain undefined for ${player.name} @ ${player.map}: ${player.x},${player.y}`));
    }

    const oldLoc = { x: player.x, y: player.y };

    if(player.stepCooldown > 0) {
      player.stepCooldown--;
    }

    player.stepCooldown--;
    player.lastDir = dir === Direction.Nowhere ? null : dir;

    player.setPos(newLoc.x, newLoc.y, player.map, tile.region);

    const map = this.world.getMap(player.map);

    if(!map || player.x <= 0 || player.y <= 0 || player.x >= map.width || player.y >= map.height) {
      this.logger.error('PlayerMovement',
        new Error(`Out of bounds for ${player.name} at ${player.region} on ${player.map}:
          ${player.x}, ${player.y}. Old ${oldLoc.x}, ${oldLoc.y}`)
      );

      this.moveToStart(player);
    }

    this.handleTile(player, tile);

    player.increaseStatistic(`Profession/${player.profession}/Steps`, 1);
    player.increaseStatistic(`Character/Movement/Steps/Normal`, 1);
    player.increaseStatistic(`Environment/Terrain/${capitalize(tile.terrain) || 'Void'}`, 1);
    player.increaseStatistic(`Map/${player.map}/Region/${player.region || 'Wilderness'}`, 1);
    player.increaseStatistic(`Map/${player.map}/Steps`, 1);

    if(player.$personalities.isActive('Drunk')) {
      player.increaseStatistic(`Character/Movement/Steps/Drunk`, 1);
    }

    if(player.$personalities.isActive('Solo')) {
      player.increaseStatistic(`Character/Movement/Steps/Solo`, 1);
    }

    if(player.$party) {
      player.increaseStatistic(`Character/Movement/Steps/Party`, 1);
    }
  }

}
