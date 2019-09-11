import { Inject, AutoWired, Singleton } from 'typescript-ioc';
import { capitalize, sample, get, set, isNumber, includes, values } from 'lodash';

import { AssetManager } from './asset-manager';
import { RNGService } from './rng-service';
import { PlayerManager } from './player-manager';
import { Player } from '../../../shared/models/entity';
import { Logger } from '../logger';
import { PartyManager } from './party-manager';
import { World } from './world';
import { GuildManager } from './guild-manager';

class EventVariableCache {
  private cache = { };

  get(domain: string, funct: string, num: number): string {
    if(isNaN(num)) throw new Error('Cache:get num cannot be NaN');
    return get(this.cache, `${domain}.${funct}.${num}`);
  }

  set(domain: string, funct: string, num: number, val: string|number): void {
    if(isNaN(num)) throw new Error('Cache:set num cannot be NaN');
    set(this.cache, `${domain}.${funct}.${num}`, val);
  }
}

@AutoWired
@Singleton
export class EventMessageParser {
  @Inject private playerManager: PlayerManager;
  @Inject private partyManager: PartyManager;
  @Inject private assetManager: AssetManager;
  @Inject private guildManager: GuildManager;
  @Inject private world: World;
  @Inject private rng: RNGService;
  @Inject private logger: Logger;

  public dict(props: any[]): string {
    const { funct } = props[0];
    let normalizedFunct = funct.toLowerCase();
    let isPlural = false;

    if(normalizedFunct === 'nouns') {
      isPlural = true;
      normalizedFunct = 'noun';
    }

    const canLowercase = normalizedFunct !== 'deity';
    let chosenItem = sample(this.assetManager.allStringAssets[normalizedFunct]) || this.placeholder();
    if(canLowercase) {
      chosenItem = normalizedFunct === funct ? chosenItem.toLowerCase() : capitalize(chosenItem);
    }

    if(normalizedFunct === 'noun' && !isPlural) {
      chosenItem = chosenItem.substring(0, chosenItem.length - 1); // supposedly, all nouns are plural
    }

    return chosenItem;
  }

  public chance(props: any[]): string {
    const { funct, args } = props[0];
    if(!this.rng.chance[funct]) return this.placeholder();
    return this.rng.chance[funct](args);
  }

  public placeholder(): string {
    return sample(this.assetManager.allStringAssets.placeholder);
  }

  public combatParty(props: any[], cache: EventVariableCache, partyData): string {
    const { funct, cacheNum } = props[0];
    if(funct === 'member') {
      return partyData.players[cacheNum] ? partyData.players[cacheNum] : this.placeholder();
    }

    return this.placeholder();
  }

  public combat(props: any[], cache: EventVariableCache, combatData): string {
    const { funct, cacheNum } = props[0];
    if(props[1]) {
      return this.combatParty([props[1]], cache, combatData.parties[cacheNum]);
    }

    if(funct === 'party') {
      return combatData.parties[cacheNum].name;
    }

    return this.placeholder();
  }

  public town(): string {
    return sample(['Norkos', 'Maeles', 'Vocalnus', 'Raburro', 'Homlet', 'Frigri', 'Astral', 'Desert', 'Tree']) + ' Town';
  }

  public map(): string {
    const map = sample(this.world.mapNames);
    if(!map) return this.placeholder();
    return map;
  }

  public pet(): string {
    const player = sample(this.playerManager.allPlayers);
    if(!player) return this.placeholder();
    return sample(Object.values(player.$pets.$petsData.allPets)).name;
  }

  public activePet(): string {
    const player = sample(this.playerManager.allPlayers);
    if(!player) return this.placeholder();
    return player.$pets.$activePet.name;
  }

  public guild(): string {
    return sample(Object.keys(this.guildManager.allGuilds));
  }

  public party(): string {
    const party = sample(this.partyManager.partyNames);
    return party ? party : this.placeholder();
  }

  public item(): string {
    const player = sample(this.playerManager.allPlayers);
    const item = sample(values(player.$inventoryData.equipment));
    return item ? item.fullName() : this.placeholder();
  }

  public class(): string {
    return sample(this.assetManager.allStringAssets.class);
  }

  // TODO: make it so you can get all but a particular player
  public player(): string {
    return sample(this.playerManager.allPlayers).fullName();
  }

  public monster(): string {
    return sample(this.assetManager.allObjectAssets.monster).name;
  }

  public ingredient(): string {
    const type = sample(['veg', 'meat', 'bread']);
    return sample(this.assetManager.allObjectAssets[type]).name;
  }

  public ownedPet(player: Player): string {
    return sample(Object.values(player.$pets.$petsData.allPets)).name;
  }

  public ownedGuild(player: Player): string {
    return player.guildName || this.placeholder();
  }

  public ownedGuildMember(player: Player): string {
    const guild = this.guildManager.getGuild(player.guildName);
    if(!guild) return this.placeholder();

    return sample(Object.keys(guild.members));
  }

  public random(props: any[], cache: EventVariableCache): string {
    const { domain, funct, cacheNum } = props[0];
    const got = cache.get(domain, funct, cacheNum);
    if(got) return got;

    const res = this[funct]();
    cache.set(domain, funct, cacheNum, res);
    return res;
  }

  private transformVarProps(props: any[], cache: EventVariableCache, eventData: any): string {
    const { domain, funct, cacheNum } = props[0];

    let retVal = null;

    try {
      const prevCacheData = cache.get(domain, funct, cacheNum);
      if(prevCacheData && funct !== 'party') return prevCacheData;
      retVal = `«${this[domain](props, cache, eventData)}»`;
      if(funct !== 'party') cache.set(domain, funct, cacheNum, retVal);
    } catch(e) {
      this.logger.error('EventVariableManager', e, { props, cache });
    }

    return retVal;
  }

  private getVarProps(string): any[] {
    const terms = string.split(' ');
    const varProps = [];
    terms.forEach(term => {
      const [props, cacheNum] = term.split('#');
      const [domain, funct] = props.split(':', 2);
      const args = props.substring(1 + funct.length + props.indexOf(funct)).trim().split('\'').join('"');
      try {
        varProps.push({
          domain,
          funct,
          cacheNum: cacheNum ? +cacheNum : 0,
          args: args ? JSON.parse(args) : null
        });
      } catch(e) {
        this.logger.error('MessageCreator', e, { string });
      }
    });

    return varProps;
  }

  private handleVariables(string, eventData = { }): string {
    const cache = new EventVariableCache();
    return string.replace(/\$([a-zA-Z\:#0-9 {}_,']+)\$/g, (match, p1) => {
      const str = this.getVarProps(p1);
      const modStr = this.transformVarProps(str, cache, eventData);
      return modStr;
    });
  }

  private genderPronoun(gender: string, replace: string): string {
    switch(replace) {
      case '%hisher': {
        switch(gender) {
          case 'male':           return 'his';
          case 'veteran male':   return 'his';
          case 'dwarf male':     return 'his';
          case 'female':         return 'her';
          case 'veteran female': return 'her';
          case 'dwarf female':   return 'her';
          default:               return 'their';
        }
      }
      case '%hishers': {
        switch(gender) {
          case 'male':           return 'his';
          case 'veteran male':   return 'his';
          case 'dwarf male':     return 'his';
          case 'female':         return 'hers';
          case 'veteran female': return 'hers';
          case 'dwarf female':   return 'hers';
          default:               return 'theirs';
        }
      }
      case '%himher': {
        switch(gender) {
          case 'male':           return 'him';
          case 'veteran male':   return 'him';
          case 'dwarf male':     return 'him';
          case 'female':         return 'her';
          case 'veteran female': return 'her';
          case 'dwarf female':   return 'her';
          default:               return 'them';
        }
      }
      case '%she':
      case '%heshe': {
        switch(gender) {
          case 'male':           return 'he';
          case 'veteran male':   return 'he';
          case 'dwarf male':     return 'he';
          case 'female':         return 'she';
          case 'veteran female': return 'she';
          case 'dwarf female':   return 'she';
          default:               return 'they';
        }
      }
    }
  }

  public stringFormat(string: string, player: Player, extra: any = { }): string {
    if(!player) return string;
    string = string.trim();

    if(extra.item)        extra.item = `«${extra.item}»`;
    if(extra.partyName)   extra.partyName = `«${extra.partyName}»`;
    if(extra.spellName)   extra.spellName = `«${extra.spellName}»`;
    if(extra.weaponName)  extra.weaponName = `«${extra.weaponName}»`;
    if(extra.targetName)  extra.targetName = `«${extra.targetName}»`;
    if(extra.casterName)  extra.casterName = `«${extra.casterName}»`;
    if(extra.treasure)    extra.treasure = `«${extra.treasure}»`;
    if(extra.deflectItem) extra.deflectItem = `«${extra.deflectItem}»`;
    if(extra.collectible) extra.collectible = `«${extra.collectible}»`;

    Object.keys(extra).forEach(key => {
      string = string.split(`%${key}`).join(isNumber(extra[key]) ? extra[key].toLocaleString() : extra[key]);
    });

    string = this.handleVariables(string, extra._eventData);

    const splitJoins = [
      { split: '%player',       join: () => `«${player.fullName()}»` },
      { split: '%pet',          join: () => `«${this.ownedPet(player)}»` },
      { split: '%guildMember',  join: () => `«${this.ownedGuildMember(player)}»` },
      { split: '%guild',        join: () => `«${this.ownedGuild(player)}»` }
    ];

    ['hishers', 'hisher', 'himher', 'she', 'heshe'].forEach(pronoun => {
      splitJoins.push({
        split: `%${pronoun}`,
        join: () => this.genderPronoun(player.gender, `%${pronoun}`)
      });
      splitJoins.push({
        split: `%${capitalize(pronoun)}`,
        join: () => capitalize(this.genderPronoun(player.gender, `%${pronoun}`))
      });
    });

    splitJoins.forEach(sj => {
      if(!includes(string, sj.split)) return;
      string = string.split(sj.split).join(sj.join());
    });

    return string;
  }
}
