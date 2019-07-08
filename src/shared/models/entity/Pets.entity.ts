
import { Entity, ObjectIdColumn, Column } from 'typeorm';

import { PlayerOwned } from './PlayerOwned';
import { Player } from './Player.entity';
import { IPet, PetUpgrade, PermanentPetUpgrade, PetAttribute, PetAffinity } from '../../interfaces';
import { Pet } from '../Pet';

@Entity()
export class Pets extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private allPets: { [key: string]: IPet };

  @Column()
  private currentPet: string;

  @Column()
  private buyablePets: { [key: string]: number };

  public get $petsData() {
    return { currentPet: this.currentPet, allPets: this.allPets, buyablePets: this.buyablePets };
  }

  public get $activePet(): IPet {
    return this.allPets[this.currentPet];
  }

  constructor() {
    super();
    if(!this.allPets) this.allPets = {};
    if(!this.currentPet) this.currentPet = '';
    if(!this.buyablePets) this.buyablePets = {};
  }

  toSaveObject() {
    const allPets = {};
    Object.keys(this.allPets).forEach(petKey => {
      allPets[petKey] = this.allPets[petKey].toSaveObject();
    });

    return { _id: this._id, owner: this.owner, currentPet: this.currentPet, buyablePets: this.buyablePets, allPets };
  }

  public init(player: Player) {

    if(!this.currentPet) this.firstInit(player);

    Object.values(this.allPets).forEach((pet: IPet) => {
      (<any>pet).$game = (<any>player).$game;
      (<any>pet).$player = player;

      this.initPet(pet);
    });

    this.syncBuyablePets(player);
  }

  public loop() {
    this.$activePet.loop();
  }

  public getTotalPermanentUpgradeValue(upgradeAttr: PermanentPetUpgrade): number {
    return Object.values(this.allPets).reduce((prev, cur) => prev + (cur.permanentUpgrades[upgradeAttr] || 0), 0);
  }

  private addNewPet(pet: IPet, setActive?: boolean) {
    this.allPets[pet.typeName] = pet;

    if(setActive) {
      this.currentPet = pet.typeName;
    }
  }

  private initPet(petData: IPet) {
    const pet = Object.assign(new Pet(), petData);
    this.allPets[petData.typeName] = pet;

    pet.init();
    (<any>pet).$game.petHelper.syncPetBasedOnProto(pet);
  }

  private firstInit(player: Player) {
    const petProto = (<any>player).$game.petHelper.getPetProto('Pet Rock');
    const madePet = (<any>player).$game.petHelper.createPet(player, petProto);
    this.addNewPet(madePet, true);
  }

  private syncBuyablePets(player: Player) {

  }

  changePetAttribute(player: Player, attribute?: PetAttribute) {
    // call syncPetAttribute for new attr
  }

  changePetAffinity(player: Player, affinity?: PetAffinity) {
    // call syncPetAttribute for new attr
  }

  upgradePet(player: Player, petUpgrade: PetUpgrade) {
    const pet = this.$activePet;
    const upgrade = this.$activePet.nextUpgrade[petUpgrade];

    player.increaseStatistic(`Pet/Upgrade/Times`, 1);
    player.increaseStatistic(`Pet/Upgrade/Spent`, upgrade.c);

    player.spendGold(upgrade.c);
    pet.upgradeLevels[petUpgrade]++;

    (<any>pet).$game.petHelper.syncPetBasedOnProto(pet);
  }

}
