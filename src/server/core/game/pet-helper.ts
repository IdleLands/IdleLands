import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { species } from 'fantastical';

import { PetAttribute, Stat, IPet, IPlayer, IPetProto, PetAffinity, PetUpgrade, IItem, ItemSlot } from '../../../shared/interfaces';
import { RNGService } from './rng-service';
import { AssetManager } from './asset-manager';
import { Pet } from '../../../shared/models/Pet';

import * as Attributes from './attributes';
import * as Affinities from './affinities';
import { Item } from '../../../shared/models';

@Singleton
@AutoWired
export class PetHelper {

  @Inject private assets: AssetManager;
  @Inject private rng: RNGService;

  getPetProto(proto: string): IPetProto {
    if(!this.assets.allPetAssets[proto]) throw new Error(`No pet proto ${proto} exists`);
    return this.assets.allPetAssets[proto];
  }

  buyPet(forPlayer: IPlayer, petName: string): IPet {
    const proto = this.getPetProto(petName);
    const pet = this.createPet(forPlayer, proto);

    (<any>pet).$game = (<any>forPlayer).$$game;
    (<any>pet).$player = forPlayer;

    pet.init();

    this.syncPetBasedOnProto(pet);

    pet.recalculateStats();

    return pet;
  }

  createPet(forPlayer: IPlayer, petProto: IPetProto): IPet {
    const gender = this.rng.pickone(forPlayer.availableGenders);
    const attribute = petProto.attribute || this.rng.pickone(forPlayer.$achievements.getPetAttributes());
    const affinity = petProto.affinity || this.rng.pickone(Object.values(PetAffinity));

    const pet = new Pet();

    const func = this.rng.pickone(Object.keys(species));

    pet.typeName = petProto.typeName;
    pet.name = species[func]();
    pet.gender = gender;
    pet.attribute = attribute;
    pet.affinity = affinity;

    return pet;
  }

  getPetUpgradeValue(pet: IPet, upgrade: PetUpgrade): number {
    const proto = this.getPetProto(pet.typeName);
    const upgradeRef = proto.upgrades[upgrade];
    if(!upgradeRef) return 0;

    if(!pet.upgradeLevels) return 0;

    const upgradeLevel = pet.upgradeLevels[upgrade];
    if(isNaN(upgradeLevel)) return 0;

    const upgradeRefC = upgradeRef[upgradeLevel];
    if(!upgradeRefC) return 0;

    return upgradeRefC.v;
  }

  getPetCost(petType: string): number {
    const proto = this.getPetProto(petType);
    return proto.cost;
  }

  syncPetNextUpgradeCost(pet: IPet): void {
    const proto = this.getPetProto(pet.typeName);

    pet.upgradeLevels = pet.upgradeLevels || {};
    pet.$currentUpgrade = {};
    pet.$nextUpgrade = {};

    Object.values(PetUpgrade).forEach(upgrade => {
      pet.$currentUpgrade[upgrade] = proto.upgrades[upgrade][pet.upgradeLevels[upgrade] || 0];
      pet.$nextUpgrade[upgrade] = proto.upgrades[upgrade][(pet.upgradeLevels[upgrade] || 0) + 1];
    });
  }

  syncPetAttribute(pet: IPet): void {
    pet.$attribute = new Attributes[pet.attribute]();
  }

  syncPetAffinity(pet: IPet): void {
    pet.$affinity = new Affinities[pet.affinity]();
  }

  petSoulForScale(pet: IPet): IItem {
    const sharePct = this.getPetUpgradeValue(pet, PetUpgrade.SoulShare);
    if(sharePct === 0) return null;

    const soulStats = { ...pet.equipment[ItemSlot.Soul][0].stats };
    Object.keys(soulStats).forEach(stat => soulStats[stat] = soulStats[stat] * (sharePct / 100));

    const soulItem = new Item();
    soulItem.init({
      type: ItemSlot.Soul,
      name: `${pet.typeName} Soul (${sharePct}%)`,
      stats: soulStats
    });

    return soulItem;
  }

  syncBasePetStats(pet: IPet): void {
    const proto = this.getPetProto(pet.typeName);

    const soulStats = { ...proto.soulStats };
    Object.keys(soulStats).forEach(stat => soulStats[stat] = soulStats[stat] * this.getPetUpgradeValue(pet, PetUpgrade.StrongerSoul));

    const soulItem = new Item();
    soulItem.init({
      name: `${pet.typeName} Soul (t${pet.rating})`,
      stats: soulStats
    });

    pet.equipment[ItemSlot.Soul] = [soulItem];
  }

  syncPetEquipmentSlots(pet: IPet): void {
    const proto = this.getPetProto(pet.typeName);
    pet.equipment = pet.equipment || {};

    Object.keys(proto.equipmentSlots).forEach(slotName => {
      pet.equipment[slotName] = pet.equipment[slotName] || [];
      pet.equipment[slotName].length = proto.equipmentSlots[slotName];
    });
  }

  syncPetAscMats(pet: IPet): void {
    const proto = this.getPetProto(pet.typeName);
    pet.$ascMaterials = proto.ascensionMaterials[pet.rating];
  }

  syncMaxLevel(pet: IPet): void {
    const proto = this.getPetProto(pet.typeName);
    pet.level.maximum = proto.maxLevelPerAscension[pet.rating];
  }

  syncPetBasedOnProto(pet: IPet): void {
    const proto = this.getPetProto(pet.typeName);
    this.syncPetNextUpgradeCost(pet);

    pet.gold.__current = pet.gold.__current || 0;
    pet.gold.maximum = this.getPetUpgradeValue(pet, PetUpgrade.GoldStorage);
    pet.permanentUpgrades = Object.assign({}, proto.permanentUpgrades);

    this.syncMaxLevel(pet);
    this.syncPetEquipmentSlots(pet);
    this.syncBasePetStats(pet);
    this.syncPetAttribute(pet);
    this.syncPetAffinity(pet);
    this.syncPetAscMats(pet);
  }

  shareSoul(pet: IPet): void {
    const player = pet.$$player;
    player.$inventory.unequipItem(player.$inventory.itemInEquipmentSlot(ItemSlot.Soul));

    const soulItem = this.petSoulForScale(pet);
    if(!soulItem) return;
    player.$inventory.equipItem(soulItem);

    player.recalculateStats();
  }

}
