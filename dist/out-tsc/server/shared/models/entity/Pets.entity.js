"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var lootastic_1 = require("lootastic");
var lodash_1 = require("lodash");
var PlayerOwned_1 = require("./PlayerOwned");
var interfaces_1 = require("../../interfaces");
var Pet_1 = require("../Pet");
var Pets = /** @class */ (function (_super) {
    tslib_1.__extends(Pets, _super);
    function Pets() {
        var _this = _super.call(this) || this;
        if (!_this.allPets)
            _this.allPets = {};
        if (!_this.currentPet)
            _this.currentPet = '';
        if (!_this.buyablePets)
            _this.buyablePets = {};
        if (!_this.ascensionMaterials)
            _this.ascensionMaterials = {};
        if (!_this.adventures)
            _this.adventures = [];
        return _this;
    }
    Object.defineProperty(Pets.prototype, "$petsData", {
        get: function () {
            return {
                currentPet: this.currentPet,
                allPets: this.allPets,
                buyablePets: this.buyablePets,
                ascensionMaterials: this.ascensionMaterials,
                adventures: this.adventures
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pets.prototype, "$activePet", {
        get: function () {
            return this.allPets[this.currentPet];
        },
        enumerable: true,
        configurable: true
    });
    Pets.prototype.toSaveObject = function () {
        var _this = this;
        var allPets = {};
        Object.keys(this.allPets).forEach(function (petKey) {
            allPets[petKey] = _this.allPets[petKey].toSaveObject();
        });
        return {
            _id: this._id,
            owner: this.owner,
            currentPet: this.currentPet,
            buyablePets: this.buyablePets,
            ascensionMaterials: this.ascensionMaterials,
            adventures: this.adventures,
            allPets: allPets
        };
    };
    Pets.prototype.init = function (player) {
        var _this = this;
        if (!this.currentPet)
            this.firstInit(player);
        Object.values(this.allPets).forEach(function (pet) {
            _this.initPet(player, pet);
        });
        this.syncBuyablePets(player);
        this.setActivePet(this.currentPet);
        this.validatePetMissionsAndQuantity(player);
    };
    Pets.prototype.loop = function () {
        this.$activePet.loop();
    };
    Pets.prototype.getTotalPermanentUpgradeValue = function (upgradeAttr) {
        return Object.values(this.allPets).reduce(function (prev, cur) { return prev + (cur.permanentUpgrades[upgradeAttr] || 0); }, 0);
    };
    Pets.prototype.getCurrentValueForUpgrade = function (upgrade) {
        return this.$activePet.$$game.petHelper.getPetUpgradeValue(this.$activePet, upgrade);
    };
    Pets.prototype.addNewPet = function (pet, setActive) {
        this.allPets[pet.typeName] = pet;
        if (setActive) {
            this.setActivePet(pet.typeName);
        }
    };
    Pets.prototype.setActivePet = function (typeName) {
        this.currentPet = typeName;
        if (this.$activePet) {
            this.$activePet.$$game.petHelper.shareSoul(this.$activePet);
        }
    };
    Pets.prototype.initPet = function (player, petData) {
        var pet = Object.assign(new Pet_1.Pet(), petData);
        this.allPets[petData.typeName] = pet;
        pet.$game = player.$$game;
        pet.$player = player;
        pet.init();
        pet.$$game.petHelper.syncPetBasedOnProto(pet);
        pet.recalculateStats();
    };
    Pets.prototype.firstInit = function (player) {
        var petProto = player.$$game.petHelper.getPetProto('Pet Rock');
        var madePet = player.$$game.petHelper.createPet(player, petProto);
        madePet.$game = player.$$game;
        madePet.$player = player;
        this.addNewPet(madePet, true);
    };
    Pets.prototype.syncBuyablePets = function (player) {
        var _this = this;
        this.buyablePets = {};
        var achieved = player.$achievements.getPets();
        achieved.forEach(function (petName) {
            if (_this.allPets[petName])
                return;
            _this.buyablePets[petName] = player.$$game.petHelper.getPetCost(petName);
        });
    };
    Pets.prototype.buyPet = function (player, petName) {
        if (player.gold < this.buyablePets[petName])
            return;
        player.increaseStatistic("Pet/Buy/Times", 1);
        player.increaseStatistic("Pet/Buy/Spent", this.buyablePets[petName]);
        player.spendGold(this.buyablePets[petName]);
        var pet = player.$$game.petHelper.buyPet(player, petName);
        pet.$game = player.$$game;
        pet.$player = player;
        this.addNewPet(pet, true);
        this.syncBuyablePets(player);
        pet.recalculateStats();
        player.syncPremium();
    };
    Pets.prototype.upgradePet = function (player, petUpgrade) {
        var pet = this.$activePet;
        var upgrade = this.$activePet.$nextUpgrade[petUpgrade];
        player.increaseStatistic("Pet/Upgrade/Times", 1);
        player.increaseStatistic("Pet/Upgrade/Spent", upgrade.c);
        player.spendGold(upgrade.c);
        pet.doUpgrade(petUpgrade);
        pet.$$game.petHelper.syncPetBasedOnProto(pet);
        pet.$$game.petHelper.shareSoul(pet);
    };
    Pets.prototype.addAscensionMaterial = function (material) {
        this.ascensionMaterials[material] = this.ascensionMaterials[material] || 0;
        this.ascensionMaterials[material]++;
    };
    Pets.prototype.ascend = function (player) {
        var _this = this;
        var pet = this.$activePet;
        if (pet.rating >= 5 || !pet.level.atMaximum())
            return false;
        var materials = pet.$$game.petHelper.getPetProto(pet.typeName).ascensionMaterials[pet.rating];
        var someMaterialsMissing = lodash_1.some(Object.keys(materials), function (mat) { return materials[mat] > _this.ascensionMaterials[mat]; });
        if (someMaterialsMissing)
            return false;
        Object.keys(materials).forEach(function (mat) { return _this.ascensionMaterials[mat] -= materials[mat]; });
        player.increaseStatistic('Pet/Ascension/Times', 1);
        pet.ascend();
        pet.$$game.petHelper.syncPetBasedOnProto(pet);
        return true;
    };
    Pets.prototype.generateAdventureFor = function (player) {
        var validTypes = interfaces_1.AdventureChances.filter(function (x) { return interfaces_1.AdventureRequirements[x.result] ? interfaces_1.AdventureRequirements[x.result](player) : true; });
        var chosenAdventure = player.$$game.rngService.weightedFromLootastic(validTypes);
        var adventure = {
            id: player.$$game.rngService.id(),
            type: chosenAdventure,
            duration: player.$$game.rngService.weightedFromLootastic(interfaces_1.AdventureDurationChances),
            finishAt: 0
        };
        return adventure;
    };
    Pets.prototype.addNewAdventure = function (player) {
        var newAdventure = this.generateAdventureFor(player);
        this.adventures.push(newAdventure);
    };
    // create pet missions equal to the stat for the player
    Pets.prototype.validatePetMissionsAndQuantity = function (player) {
        var totalAdventures = player.$statistics.get('Game/Premium/Upgrade/PetMissions');
        while (this.adventures.length < totalAdventures) {
            this.addNewAdventure(player);
        }
    };
    // check if all pets are able to go on mission. if so, mark them as in mission
    Pets.prototype.embarkOnPetMission = function (player, adventureId, pets) {
        var _this = this;
        var adventure = lodash_1.find(this.adventures, { id: adventureId });
        var petRefs = pets.map(function (x) { return _this.allPets[x]; }).filter(function (x) { return x && !x.currentAdventureId; });
        if (pets.length === 0 || petRefs.length !== pets.length || !adventure)
            return false;
        // update finishAt to be the end time
        adventure.finishAt = Date.now() + (3600 * 1000 * adventure.duration);
        petRefs.forEach(function (pet) { return pet.currentAdventureId = adventureId; });
        player.increaseStatistic('Pet/Adventure/PetsSent', pets.length);
        return true;
    };
    // clear pet currentAdventureId
    Pets.prototype.cashInMission = function (player, adventureId) {
        var adventure = lodash_1.find(this.adventures, { id: adventureId });
        if (!adventure || adventure.finishAt > Date.now())
            return false;
        lodash_1.pull(this.adventures, adventure);
        this.addNewAdventure(player);
        var totalPetsSentOnAdventure = 0;
        Object.values(this.allPets).forEach(function (pet) {
            if (pet.currentAdventureId !== adventureId)
                return;
            pet.currentAdventureId = '';
            totalPetsSentOnAdventure++;
        });
        var totalRewards = Math.floor(interfaces_1.BaseAdventureRewardCount[adventure.duration] * totalPetsSentOnAdventure);
        if (player.$$game.rngService.likelihood(50))
            totalRewards++;
        if (player.$$game.rngService.likelihood(25))
            totalRewards++;
        if (player.$$game.rngService.likelihood(10))
            totalRewards++;
        var table = new lootastic_1.LootTable(interfaces_1.AdventureRewards[adventure.type]);
        var rewards = table.chooseWithReplacement(totalRewards);
        var realRewards = player.$premium.validateAndEarnGachaRewards(player, rewards);
        player.increaseStatistic('Pet/Adventure/Hours', adventure.duration);
        player.increaseStatistic('Pet/Adventure/TotalAdventures', 1);
        player.increaseStatistic('Pet/Adventure/TotalRewards', totalRewards);
        return { rewards: realRewards, adventure: adventure };
    };
    Pets.prototype.resetEquipment = function () {
        Object.values(this.allPets).forEach(function (pet) {
            pet.unequipAll();
        });
    };
    tslib_1.__decorate([
        typeorm_1.ObjectIdColumn(),
        tslib_1.__metadata("design:type", String)
    ], Pets.prototype, "_id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Pets.prototype, "allPets", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Pets.prototype, "currentPet", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Pets.prototype, "buyablePets", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Pets.prototype, "ascensionMaterials", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Array)
    ], Pets.prototype, "adventures", void 0);
    Pets = tslib_1.__decorate([
        typeorm_1.Entity(),
        tslib_1.__metadata("design:paramtypes", [])
    ], Pets);
    return Pets;
}(PlayerOwned_1.PlayerOwned));
exports.Pets = Pets;
//# sourceMappingURL=Pets.entity.js.map