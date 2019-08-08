
import { Entity, ObjectIdColumn, Column } from 'typeorm';

import { LootTable } from 'lootastic';
import { some, find, pull } from 'lodash';

import { PlayerOwned } from './PlayerOwned';
import { Player } from './Player.entity';
import { IPet, PetUpgrade, PermanentUpgrade, PetAttribute, PetAffinity, IAdventure,
  AdventureChances, AdventureRequirements, AdventureDurationChances, BaseAdventureRewardCount, AdventureRewards } from '../../interfaces';
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

  @Column()
  private adventures: IAdventure[];

  public get $petsData() {
    return {
      currentPet: this.currentPet,
      allPets: this.allPets,
      buyablePets: this.buyablePets,
      ascensionMaterials: this.ascensionMaterials,
      adventures: this.adventures
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
    if(!this.adventures) this.adventures = [];
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
      adventures: this.adventures,
      allPets
    };
  }

  public init(player: Player) {

    if(!this.currentPet) this.firstInit(player);

    Object.values(this.allPets).forEach((pet: IPet) => {
      this.initPet(player, pet);
    });

    this.syncBuyablePets(player);

    this.setActivePet(this.currentPet);

    this.validatePetMissionsAndQuantity(player);
  }

  public loop() {
    this.$activePet.loop();
  }

  public getTotalPermanentUpgradeValue(upgradeAttr: PermanentUpgrade): number {
    return Object.values(this.allPets).reduce((prev, cur) => prev + (cur.permanentUpgrades[upgradeAttr] || 0), 0);
  }

  public getCurrentValueForUpgrade(upgrade: PetUpgrade): number {
    return this.$activePet.$$game.petHelper.getPetUpgradeValue(this.$activePet, upgrade);
  }

  private addNewPet(pet: Pet, setActive?: boolean) {
    this.allPets[pet.typeName] = pet;

    if(setActive) {
      this.setActivePet(pet.typeName);
    }
  }

  public setActivePet(typeName: string) {
    this.currentPet = typeName;

    if(this.$activePet) {
      this.$activePet.$$game.petHelper.shareSoul(this.$activePet);
    }
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
    pet.$$game.petHelper.shareSoul(pet);
  }

  addAscensionMaterial(material: string): void {
    this.ascensionMaterials[material] = this.ascensionMaterials[material] || 0;
    this.ascensionMaterials[material]++;
  }

  ascend(player: Player): boolean {
    const pet = this.$activePet;
    if(pet.rating >= 5 || !pet.level.atMaximum()) return false;

    const materials = pet.$$game.petHelper.getPetProto(pet.typeName).ascensionMaterials[pet.rating];
    const someMaterialsMissing = some(Object.keys(materials), (mat) => materials[mat] > this.ascensionMaterials[mat]);
    if(someMaterialsMissing) return false;

    Object.keys(materials).forEach(mat => this.ascensionMaterials[mat] -= materials[mat]);

    player.increaseStatistic('Pet/Ascension/Times', 1);
    pet.ascend();
    pet.$$game.petHelper.syncPetBasedOnProto(pet);

    return true;
  }

  private generateAdventureFor(player: Player): IAdventure {
    const validTypes = AdventureChances.filter(x => AdventureRequirements[x.result] ? AdventureRequirements[x.result](player) : true);
    const chosenAdventure = player.$$game.rngService.weightedFromLootastic(validTypes);

    const adventure: IAdventure = {
      id: player.$$game.rngService.id(),
      type: chosenAdventure,
      duration: player.$$game.rngService.weightedFromLootastic(AdventureDurationChances),
      finishAt: 0
    };

    return adventure;
  }

  private addNewAdventure(player: Player) {
    const newAdventure = this.generateAdventureFor(player);
    this.adventures.push(newAdventure);
  }

  // create pet missions equal to the stat for the player
  public validatePetMissionsAndQuantity(player: Player) {
    const totalAdventures = player.$statistics.get('Game/Premium/Upgrade/PetMissions');

    while(this.adventures.length < totalAdventures) {
      this.addNewAdventure(player);
    }
  }

  // check if all pets are able to go on mission. if so, mark them as in mission
  public embarkOnPetMission(player: Player, adventureId: string, pets: string[]): boolean {
    const adventure = find(this.adventures, { id: adventureId });
    const petRefs = pets.map(x => this.allPets[x]).filter(x => x && !x.currentAdventureId);

    if(pets.length === 0 || petRefs.length !== pets.length || !adventure) return false;

    // update finishAt to be the end time
    adventure.finishAt = Date.now() + (3600 * 1000 * adventure.duration);
    petRefs.forEach(pet => pet.currentAdventureId = adventureId);

    player.increaseStatistic('Pet/Adventure/PetsSent', pets.length);

    return true;
  }

  // clear pet currentAdventureId
  public cashInMission(player: Player, adventureId: string): false|{ rewards, adventure } {
    const adventure = find(this.adventures, { id: adventureId });
    if(!adventure || adventure.finishAt > Date.now()) return false;

    pull(this.adventures, adventure);
    this.addNewAdventure(player);

    let totalPetsSentOnAdventure = 0;
    Object.values(this.allPets).forEach(pet => {
      if(pet.currentAdventureId !== adventureId) return;
      pet.currentAdventureId = '';
      totalPetsSentOnAdventure++;
    });

    let totalRewards = Math.floor(BaseAdventureRewardCount[adventure.duration] * totalPetsSentOnAdventure);
    if(player.$$game.rngService.likelihood(50)) totalRewards++;
    if(player.$$game.rngService.likelihood(25)) totalRewards++;
    if(player.$$game.rngService.likelihood(10)) totalRewards++;

    const table = new LootTable(AdventureRewards[adventure.type]);
    const rewards = table.chooseWithReplacement(totalRewards);

    const realRewards = player.$premium.validateAndEarnGachaRewards(player, rewards);

    player.increaseStatistic('Pet/Adventure/Hours', adventure.duration);
    player.increaseStatistic('Pet/Adventure/TotalAdventures', 1);
    player.increaseStatistic('Pet/Adventure/TotalRewards', totalRewards);

    return { rewards: realRewards, adventure };
  }

  resetEquipment() {
    Object.values(this.allPets).forEach(pet => {
      pet.unequipAll();
    });
  }

}
