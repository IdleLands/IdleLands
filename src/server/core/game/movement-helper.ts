import { AutoWired, Singleton, Inject } from 'typescript-ioc';

import { capitalize, get } from 'lodash';

import * as teleports from '../../../../assets/maps/content/teleports.json';

import { Player } from '../../../shared/models';
import { World, Tile } from './world';
import { Direction, MovementType } from '../../../shared/interfaces';
import { RNGService } from './rng-service';
import { EventManager } from './event-manager';
import { Logger } from '../logger';

@Singleton
@AutoWired
export class MovementHelper {

  @Inject private world: World;
  @Inject private logger: Logger;
  @Inject private rng: RNGService;
  @Inject private eventManager: EventManager;

  private directions: Direction[] = [1, 2, 3, 6, 9, 8, 7, 4];
  private allTeleports = {
    ...teleports.towns,
    ...teleports.trainers,
    ...teleports.other,
    ...teleports.bosses,
    ...teleports.dungeons
  };

  public locToTeleport(name) {
    return this.allTeleports[name];
  }

  public moveToStart(player: Player): void {
    player.map = 'Norkos';
    player.x = 10;
    player.y = 10;
  }

  private getTileAt(map: string, x: number, y: number): Tile {
    return this.world.getMap(map).getTile(x, y);
  }

  // TODO: finish this
  private canEnterTile(player: Player, tile: Tile): boolean {
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

  private getInitialWeight(player: Player) {

    let weight = [300, 40, 7,  3,  1,  3,  7,  40];

    const drunk = false;

    if(player.lastDir) {
      const lastDirIndex = this.directions.indexOf(player.lastDir);
      if(lastDirIndex !== -1) {
        weight = weight.slice(weight.length - lastDirIndex).concat(weight.slice(0, weight.length - lastDirIndex));
      }
    } else if(drunk) {
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
      this.eventManager.doEventFor(player, forceEvent, tile.object.properties);
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
        const toLocData = this.locToTeleport(dest.toLoc);
        dest.x = toLocData.x;
        dest.y = toLocData.y;
        dest.map = toLocData.map;
        dest.destName = toLocData.formalName;
      }
    }

    player.map = dest.map;
    player.x = dest.x;
    player.y = dest.y;

    player.region = tile.region;

    this.handleTile(player, tile, 'Teleport');

    player.$statistics.increase(`Character.Movement.${capitalize(dest.movementType)}`, 1);
  }

  // TODO: handle collectible
  private handleTileCollectible(player: Player, tileData: any) {

  }

  // TODO: handle trianer
  private handleTileTrainer(player: Player, tileData: any) {

  }

  // TODO: handle boss
  private handleTileBoss(player: Player, tileData: any) {

  }

  // TODO: handle boss party
  private handleTileBossParty(player: Player, tileData: any) {

  }

  // TODO: handle treasure
  private handleTileTreasure(player: Player, tileData: any) {

  }

  public takeStep(player: Player) {

    if(player.$personalities.isActive('Camping')) {
      player.$statistics.increase('Character.Movement.Steps.Camping', 1);
      return;
    }

    const weight = this.getInitialWeight(player);

    if(!player.stepCooldown) player.stepCooldown = 0;

    let attempts = 1;
    let { index, dir } = this.pickRandomDirection(player, weight);
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

    player.stepCooldown--;
    player.lastDir = dir === Direction.Nowhere ? null : dir;
    player.x = newLoc.x;
    player.y = newLoc.y;

    const map = this.world.getMap(player.map);

    if(!map || player.x <= 0 || player.y <= 0 || player.x >= map.width || player.y >= map.height) {
      this.logger.error('PlayerMovement',
        new Error(`Out of bounds for ${player.name} at ${player.region} on ${player.map}:
          ${player.x}, ${player.y}. Old ${oldLoc.x}, ${oldLoc.y}`)
      );

      this.moveToStart(player);
    }

    this.handleTile(player, tile);

    player.$statistics.increase(`Profession.${player.profession}.Steps`, 1);
    player.$statistics.increase(`Character.Movement.Steps.Normal`, 1);
    player.$statistics.increase(`Environment.Terrain.${capitalize(tile.terrain) || 'Void'}`, 1);
    player.$statistics.increase(`Map.${player.map}.Region.${player.region || 'Wilderness'}`, 1);
    player.$statistics.increase(`Map.${player.map}.Steps`, 1);

    if(player.$personalities.isActive('Drunk')) {
      player.$statistics.increase(`Character.Movement.Steps.Drunk`, 1);
    }
  }

}
