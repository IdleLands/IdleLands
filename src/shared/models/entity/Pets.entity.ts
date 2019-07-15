
import { Entity, ObjectIdColumn, Column } from 'typeorm';

import { PlayerOwned } from './PlayerOwned';
import { Player } from './Player.entity';
import { IPet, PetUpgrade, PermanentUpgrade, PetAttribute, PetAffinity } from '../../interfaces';
import { Pet } from '../Pet';

@Entity()
export class Pets extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private allPets: { [key: string]: Pet };

  @Column()
  private currentPet: string;

  @Column()
  private buyablePets: { [key: string]: number };

  @Column()
  private ascensionMaterials: { [key: string]: number };

  public get $petsData() {
    return {
      currentPet: this.currentPet,
      allPets: this.allPets,
      buyablePets: this.buyablePets,
      ascensionMaterials: this.ascensionMaterials
    };
  }

  public get $activePet(): Pet {
    return this.allPets[this.currentPet];
  }

  constructor() {
    super();
    if(!this.allPets) this.allPets = {};
    if(!this.currentPet) this.currentPet = '';
    if(!this.buyablePets) this.buyablePets = {};
    if(!this.ascensionMaterials) this.ascensionMaterials = {};
  }

  toSaveObject() {
    const allPets = {};
    Object.keys(this.allPets).forEach(petKey => {
      allPets[petKey] = this.allPets[petKey].toSaveObject();
    });

    return {
      _id: this._id,
      owner: this.owner,
      currentPet: this.currentPet,
      buyablePets: this.buyablePets,
      ascensionMaterials: this.ascensionMaterials,
      allPets
    };
  }

  public init(player: Player) {

    if(!this.currentPet) this.firstInit(player);

    Object.values(this.allPets).forEach((pet: IPet) => {
      this.initPet(player, pet);
    });

    this.syncBuyablePets(player);
  }

  public loop() {
    this.$activePet.loop();
  }

  public getTotalPermanentUpgradeValue(upgradeAttr: PermanentUpgrade): number {
    return Object.values(this.allPets).reduce((prev, cur) => prev + (cur.permanentUpgrades[upgradeAttr] || 0), 0);
  }

  private addNewPet(pet: Pet, setActive?: boolean) {
    this.allPets[pet.typeName] = pet;

    if(setActive) {
      this.setActivePet(pet.typeName);
    }
  }

  public setActivePet(typeName: string) {
    this.currentPet = typeName;
  }

  private initPet(player: Player, petData: IPet) {
    const pet = Object.assign(new Pet(), petData);
    this.allPets[petData.typeName] = pet;

    (<any>pet).$game = player.$$game;
    (<any>pet).$player = player;

    pet.init();
    pet.$$game.petHelper.syncPetBasedOnProto(pet);
    pet.recalculateStats();
  }

  private firstInit(player: Player) {
    const petProto = player.$$game.petHelper.getPetProto('Pet Rock');
    const madePet = player.$$game.petHelper.createPet(player, petProto);

    (<any>madePet).$game = player.$$game;
    (<any>madePet).$player = player;

    this.addNewPet(madePet, true);
  }

  public syncBuyablePets(player: Player) {
    this.buyablePets = {};

    const achieved = player.$achievements.getPets();
    achieved.forEach(petName => {
      if(this.allPets[petName]) return;
      this.buyablePets[petName] = player.$$game.petHelper.getPetCost(petName);
    });
  }

  changePetAttribute(player: Player, attribute?: PetAttribute) {
    // call syncPetAttribute for new attr
  }

  changePetAffinity(player: Player, affinity?: PetAffinity) {
    // call syncPetAttribute for new attr
  }

  buyPet(player: Player, petName: string) {
    if(player.gold < this.buyablePets[petName]) return;

    player.increaseStatistic(`Pet/Buy/Times`, 1);
    player.increaseStatistic(`Pet/Buy/Spent`, this.buyablePets[petName]);
    player.spendGold(this.buyablePets[petName]);

    const pet = player.$$game.petHelper.buyPet(player, petName);
    this.addNewPet(pet, true);

    this.syncBuyablePets(player);

    player.syncPremium();
  }

  upgradePet(player: Player, petUpgrade: PetUpgrade) {
    const pet = this.$activePet;
    const upgrade = this.$activePet.$nextUpgrade[petUpgrade];

    player.increaseStatistic(`Pet/Upgrade/Times`, 1);
    player.increaseStatistic(`Pet/Upgrade/Spent`, upgrade.c);

    player.spendGold(upgrade.c);
    pet.doUpgrade(petUpgrade);

    pet.$$game.petHelper.syncPetBasedOnProto(pet);
  }

  addAscensionMaterial(material: string): void {
    this.ascensionMaterials[material] = this.ascensionMaterials[material] || 0;
    this.ascensionMaterials[material]++;
  }

}
