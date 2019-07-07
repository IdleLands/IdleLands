import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { species } from 'fantastical';

import { PetAttribute, Stat, IPet, IPlayer, IPetProto, PermanentPetUpgrade, PetAffinity, PetUpgrade } from '../../../shared/interfaces';
import { RNGService } from './rng-service';
import { AssetManager } from './asset-manager';
import { Pet } from '../../../shared/models/Pet';

@Singleton
@AutoWired
export class PetHelper {

  @Inject private assets: AssetManager;
  @Inject private rng: RNGService;

  getPetProto(proto: string): IPetProto {
    if(!this.assets.allPetAssets[proto]) throw new Error(`No pet proto ${proto} exists`);
    return this.assets.allPetAssets[proto];
  }

  buyPet(forPlayer: IPlayer, petProto: IPetProto): IPet {
    // check gold cost
    // deduct gold cost
    // create pet
    // sync base stats to pet
    // sync player premium stats based on pet
    return null;
  }

  createPet(forPlayer: IPlayer, petProto: IPetProto): IPet {
    const gender = this.rng.pickone(forPlayer.availableGenders);
    const attribute = petProto.attribute || this.rng.pickone(Object.values(PetAttribute));
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
    return proto.upgrades[upgrade][pet.upgradeLevels[upgrade]].v;
  }

  syncPetNextUpgradeCost(pet: IPet): void {
    const proto = this.getPetProto(pet.typeName);

    pet.currentUpgrade = {};
    pet.nextUpgrade = {};

    Object.values(PetUpgrade).forEach(upgrade => {
      pet.currentUpgrade[upgrade] = proto.upgrades[upgrade][pet.upgradeLevels[upgrade]];
      pet.nextUpgrade[upgrade] = proto.upgrades[upgrade][pet.upgradeLevels[upgrade] + 1];
    });
  }

  syncBasePetStats(pet: IPet): void {
    // compare base soul vs type soul
    // get attribute stats and add them to soul
  }

  syncPetBasedOnProto(pet: IPet): void {
    const proto = this.getPetProto(pet.typeName);

    pet.level.maximum = this.getPetUpgradeValue(pet, PetUpgrade.MaxLevel);
    pet.gold.maximum = this.getPetUpgradeValue(pet, PetUpgrade.GoldStorage);
    pet.permanentUpgrades = Object.assign({}, proto.permanentUpgrades);

    this.syncPetNextUpgradeCost(pet);
    this.syncBasePetStats(pet);
  }

  getSoulStatsForAttribute(attribute: PetAttribute): { [key in Stat]?: number } {
    return {};
  }

}
