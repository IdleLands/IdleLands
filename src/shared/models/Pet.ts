
import { pickBy, find, pull, clone } from 'lodash';
import { RestrictedNumber } from 'restricted-number';
import { nonenumerable } from 'nonenumerable';

import { Item } from './Item';
import { IGame, Stat, IParty, IPet, PetAffinity, PetAttribute, IBuff, IPlayer,
  PetUpgrade, PermanentUpgrade, IAttribute, IAffinity, ItemSlot } from '../interfaces';
import { EventName } from '../../server/core/game/events/Event';

export class Pet implements IPet {

  @nonenumerable
  private $game: IGame;

  public get $$game(): IGame {
    return this.$game;
  }

  @nonenumerable
  private $player: IPlayer;

  public get $$player(): IPlayer {
    return this.$player;
  }

  // pet-related vars
  public name: string;
  public level: RestrictedNumber;
  public xp: RestrictedNumber;
  public gender: string;
  public gold: RestrictedNumber;

  public typeName: string;
  public affinity: PetAffinity;
  public $affinity: IAffinity;
  public attribute: PetAttribute;
  public $attribute: IAttribute;
  public $ascMaterials: any;
  public rating: number;
  public gatherTick: number;
  public currentAdventureId: string;

  public upgradeLevels: { [key in PetUpgrade]?: number };

  private stats: any;
  public get currentStats() {
    return this.stats;
  }

  private $statTrail: any;

  @nonenumerable
  public $party?: IParty;

  public $currentUpgrade: { [key in PetUpgrade]?: { a?: number, v: number, c: number } };
  public $nextUpgrade: { [key in PetUpgrade]?: { a?: number, v: number, c: number } };

  public permanentUpgrades: { [key in PermanentUpgrade]?: number };

  public equipment: { [key in ItemSlot]?: Item[] };

  init() {

    // validate that important properties exist
    if(!this.level) this.level = new RestrictedNumber(1, 100, 1);
    if(!this.xp) this.xp = new RestrictedNumber(0, 100, 0);
    if(!this.gender) this.gender = 'male';
    if(!this.gold) this.gold = new RestrictedNumber(0, 0, 0);
    if(!this.rating) this.rating = 0;
    if(!this.stats) this.stats = {};
    if(!this.$statTrail) this.$statTrail = {};
    if(!this.upgradeLevels) this.upgradeLevels = {};
    if(!this.equipment) this.equipment = {};
    if(!this.gatherTick && this.upgradeLevels[PetUpgrade.GatherTime]) this.updateGatherTick();

    // reset some aspects
    this.level = new RestrictedNumber(this.level.minimum, this.level.maximum, this.level.__current);
    this.xp = new RestrictedNumber(this.xp.minimum, this.xp.maximum, this.xp.__current);
    this.gold = new RestrictedNumber(this.gold.minimum, this.gold.maximum, this.gold.__current);

    Object.values(PetUpgrade).forEach(upgrade => {
      this.upgradeLevels[upgrade] = this.upgradeLevels[upgrade] || 0;
    });

    Object.keys(this.equipment).forEach(itemSlot => {
      this.equipment[itemSlot] = this.equipment[itemSlot].map(item => {
        if(!item) return;

        const itemRef = new Item();
        itemRef.init(item);
        return itemRef;
      });
    });

    this.recalculateStats();
  }

  public toSaveObject(): any {
    return pickBy(this, (value, key) => !key.startsWith('$') && key !== 'currentStats');
  }

  async loop(): Promise<void> {
    this.gainXP(0);
    this.gainGold(0);

    if(this.gatherTick && Date.now() > this.gatherTick) {
      this.doFind();
      this.updateGatherTick();
    }
  }

  public getStat(stat: Stat): number {
    return this.stats[stat];
  }

  public canLevelUp(): boolean {
    return !this.level.atMaximum();
  }

  public gainXP(xp = 0, addMyXP = true): number {

    let remainingXP = addMyXP ? Math.floor(xp + this.stats.xp) : xp;
    const totalXP = remainingXP;

    if(remainingXP < 0) {
      this.xp.add(remainingXP);
      return remainingXP;
    }

    while(remainingXP > 0 && this.canLevelUp()) {
      const preAddXP = this.xp.total;
      this.xp.add(remainingXP);

      const xpDiff = this.xp.total - preAddXP;
      remainingXP -= xpDiff;

      this.tryLevelUp();
    }

    return totalXP;
  }

  public spendGold(gold = 0): number {
    return this.gainGold(-gold);
  }

  public gainGold(gold = 0, addMyGold = true): number {

    const remainingGold = addMyGold ? Math.floor(gold + this.stats.gold) : gold;

    if(remainingGold < 0) {
      this.gold.add(remainingGold);
      return remainingGold;
    }

    this.gold.add(remainingGold);

    return remainingGold;
  }

  private tryLevelUp(): void {
    if(!this.xp.atMaximum()) return;
    this.level.add(1);

    this.xp.toMinimum();
    this.resetMaxXP();
  }

  public resetMaxXP(): void {
    this.xp.maximum = this.$$game.calculatorHelper.calcLevelMaxXP(this.level.total);
  }

  private addStatTrail(stat: Stat, val: number, reason?: string) {
    if(val === 0 || stat === Stat.SPECIAL) return;

    val = Math.floor(val);

    this.stats[stat] = this.stats[stat] || 0;
    this.stats[stat] += val;
    this.$statTrail[stat] = this.$statTrail[stat] || [];
    this.$statTrail[stat].push({ val, reason });
  }

  public recalculateStats(): void {
    if(!this.$affinity) return;

    this.stats = {};

    // dynamically-calculated
    // first, we do the addition-based adds
    const allStats = Object.keys(Stat).map(key => Stat[key]);
    allStats.forEach(stat => {

      this.stats[stat] = this.stats[stat] || 0;

      Object.keys(this.equipment).forEach(itemSlot => {
        this.equipment[itemSlot].forEach(item => {
          if(!item || !item.stats[stat]) return;

          this.addStatTrail(stat, item.stats[stat], `Item: ${item.name}`);
        });
      });

      Object.keys(this.$player.buffWatches).forEach(buffKey => {
        this.$player.buffWatches[buffKey].forEach((buff: IBuff) => {
          if(!buff.stats || !buff.stats[stat]) return;
          this.addStatTrail(stat, buff.stats[stat], `Player Buff: ${buff.name}`);
        });
      });

      const profBasePerLevel = this.$affinity.calcLevelStat(this.level.total, stat);
      this.addStatTrail(stat, profBasePerLevel, `${this.affinity}: Base / Lv. (${profBasePerLevel / this.level.total})`);

      // make sure it is 0. no super negatives.
      this.stats[stat] = Math.max(0, this.stats[stat]);
    });

    const copyStats = clone(this.stats);
    allStats.forEach(checkStat => {
      const profBoosts = this.$affinity.calcStatsForStats(copyStats, checkStat);
      profBoosts.forEach(({ stat, boost, tinyBoost }) => {
        this.addStatTrail(checkStat, boost, `${this.affinity} ${checkStat.toUpperCase()} / ${stat.toUpperCase()} (${tinyBoost})`);
      });
    });

    // base values
    this.stats.hp = Math.max(1, this.stats.hp);
    this.stats.xp = Math.max(1, this.stats.xp);
    this.stats.gold = Math.max(1, this.stats.gold);
  }

  public findEquippedItemById(itemSlot: ItemSlot, itemId: string): Item {
    return find(this.equipment[itemSlot], { id: itemId });
  }

  public equip(item: Item): boolean {
    if(this.equipment[item.type].every(x => !!x)) {
      return false;
    }

    // push the new item to the beginning and pop an empty
    this.equipment[item.type].unshift(item);
    this.equipment[item.type].pop();

    this.recalculateStats();
    return true;
  }

  public unequip(item: Item): boolean {
    pull(this.equipment[item.type], item);
    this.equipment[item.type].push(null);

    this.$$game.petHelper.syncPetEquipmentSlots(this);

    this.recalculateStats();
    return true;
  }

  public unequipAll() {
    this.equipment = {};
    this.$$game.petHelper.syncPetBasedOnProto(this);
    this.recalculateStats();
  }

  public sellItem(item: Item): number {
    const value = item.score;
    const modValue = this.gainGold(value);

    return modValue;
  }

  public doUpgrade(upgrade: PetUpgrade) {
    this.upgradeLevels[upgrade]++;

    if(upgrade === PetUpgrade.GatherTime) {
      this.updateGatherTick();
    }
  }

  private updateGatherTick() {
    if(!this.$$game) return;

    const tickValue = this.$$game.petHelper.getPetUpgradeValue(this, PetUpgrade.GatherTime);
    if(!tickValue) return;

    this.gatherTick = Date.now() + (tickValue * 1000);
  }

  private doFind() {
    const ilpFind = this.$$game.petHelper.getPetUpgradeValue(this, PetUpgrade.ILPGatherQuantity);
    const itemFindLevelBoost = this.$$game.petHelper.getPetUpgradeValue(this, PetUpgrade.ItemFindLevelBoost);
    const itemFindQualityBoost = this.$$game.petHelper.getPetUpgradeValue(this, PetUpgrade.ItemFindQualityBoost);
    const itemFindPercentBoostStat = this.$$game.petHelper.getPetUpgradeValue(this, PetUpgrade.ItemFindLevelPercent) / 100;
    const itemFindPercentBoost = Math.floor(this.$player.level.total * itemFindPercentBoostStat);

    const foundItem = this.$$game.itemGenerator.generateItemForPlayer(this.$player, {
      generateLevel: this.level.total + itemFindLevelBoost + itemFindPercentBoost, qualityBoost: itemFindQualityBoost
    });

    this.$player.gainILP(ilpFind);
    this.$$game.eventManager.doEventFor(this.$player, EventName.FindItem, { fromPet: true, item: foundItem });
  }

  public ascend() {
    this.rating++;
  }

}
