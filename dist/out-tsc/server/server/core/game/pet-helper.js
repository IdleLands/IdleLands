"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var fantastical_1 = require("fantastical");
var interfaces_1 = require("../../../shared/interfaces");
var rng_service_1 = require("./rng-service");
var asset_manager_1 = require("./asset-manager");
var Pet_1 = require("../../../shared/models/Pet");
var Attributes = require("./attributes");
var Affinities = require("./affinities");
var models_1 = require("../../../shared/models");
var PetHelper = /** @class */ (function () {
    function PetHelper() {
    }
    PetHelper.prototype.getPetProto = function (proto) {
        if (!this.assets.allPetAssets[proto])
            throw new Error("No pet proto " + proto + " exists");
        return this.assets.allPetAssets[proto];
    };
    PetHelper.prototype.buyPet = function (forPlayer, petName) {
        var proto = this.getPetProto(petName);
        var pet = this.createPet(forPlayer, proto);
        pet.$game = forPlayer.$$game;
        pet.$player = forPlayer;
        pet.init();
        this.syncPetBasedOnProto(pet);
        pet.recalculateStats();
        return pet;
    };
    PetHelper.prototype.randomName = function () {
        var func = this.rng.pickone(Object.keys(fantastical_1.species));
        return fantastical_1.species[func]();
    };
    PetHelper.prototype.createPet = function (forPlayer, petProto) {
        var gender = this.rng.pickone(forPlayer.availableGenders);
        var attribute = petProto.attribute || this.rng.pickone(forPlayer.$achievements.getPetAttributes());
        var affinity = petProto.affinity || this.rng.pickone(Object.values(interfaces_1.PetAffinity));
        var pet = new Pet_1.Pet();
        pet.typeName = petProto.typeName;
        pet.name = this.randomName();
        pet.gender = gender;
        pet.attribute = attribute;
        pet.affinity = affinity;
        return pet;
    };
    PetHelper.prototype.getPetUpgradeValue = function (pet, upgrade) {
        var proto = this.getPetProto(pet.typeName);
        var upgradeRef = proto.upgrades[upgrade];
        if (!upgradeRef)
            return 0;
        if (!pet.upgradeLevels)
            return 0;
        var upgradeLevel = pet.upgradeLevels[upgrade];
        if (isNaN(upgradeLevel))
            return 0;
        var upgradeRefC = upgradeRef[upgradeLevel];
        if (!upgradeRefC)
            return 0;
        return upgradeRefC.v;
    };
    PetHelper.prototype.getPetCost = function (petType) {
        var proto = this.getPetProto(petType);
        return proto.cost;
    };
    PetHelper.prototype.syncPetNextUpgradeCost = function (pet) {
        var proto = this.getPetProto(pet.typeName);
        pet.upgradeLevels = pet.upgradeLevels || {};
        pet.$currentUpgrade = {};
        pet.$nextUpgrade = {};
        Object.values(interfaces_1.PetUpgrade).forEach(function (upgrade) {
            pet.$currentUpgrade[upgrade] = proto.upgrades[upgrade][pet.upgradeLevels[upgrade] || 0];
            pet.$nextUpgrade[upgrade] = proto.upgrades[upgrade][(pet.upgradeLevels[upgrade] || 0) + 1];
        });
    };
    PetHelper.prototype.syncPetAttribute = function (pet) {
        pet.$attribute = new Attributes[pet.attribute]();
    };
    PetHelper.prototype.syncPetAffinity = function (pet) {
        pet.$affinity = new Affinities[pet.affinity]();
    };
    PetHelper.prototype.petSoulForScale = function (pet) {
        var sharePct = this.getPetUpgradeValue(pet, interfaces_1.PetUpgrade.SoulShare);
        if (sharePct === 0)
            return null;
        var soulStats = tslib_1.__assign({}, pet.equipment[interfaces_1.ItemSlot.Soul][0].stats);
        Object.keys(soulStats).forEach(function (stat) { return soulStats[stat] = soulStats[stat] * (sharePct / 100); });
        var soulItem = new models_1.Item();
        soulItem.init({
            type: interfaces_1.ItemSlot.Soul,
            name: pet.typeName + " Soul (" + sharePct + "%)",
            stats: soulStats
        });
        return soulItem;
    };
    PetHelper.prototype.syncBasePetStats = function (pet) {
        var _this = this;
        var proto = this.getPetProto(pet.typeName);
        var soulStats = tslib_1.__assign({}, proto.soulStats);
        Object.keys(soulStats).forEach(function (stat) { return soulStats[stat] = soulStats[stat] * _this.getPetUpgradeValue(pet, interfaces_1.PetUpgrade.StrongerSoul); });
        var soulItem = new models_1.Item();
        soulItem.init({
            name: pet.typeName + " Soul (t" + pet.rating + ")",
            stats: soulStats
        });
        pet.equipment[interfaces_1.ItemSlot.Soul] = [soulItem];
    };
    PetHelper.prototype.syncPetEquipmentSlots = function (pet) {
        var proto = this.getPetProto(pet.typeName);
        pet.equipment = pet.equipment || {};
        Object.keys(proto.equipmentSlots).forEach(function (slotName) {
            pet.equipment[slotName] = pet.equipment[slotName] || [];
            if (pet.equipment[slotName].length === 0) {
                pet.equipment[slotName] = Array(proto.equipmentSlots[slotName]).fill(null);
            }
            pet.equipment[slotName].length = proto.equipmentSlots[slotName];
        });
    };
    PetHelper.prototype.syncPetAscMats = function (pet) {
        var proto = this.getPetProto(pet.typeName);
        pet.$ascMaterials = proto.ascensionMaterials[pet.rating];
    };
    PetHelper.prototype.syncMaxLevel = function (pet) {
        var proto = this.getPetProto(pet.typeName);
        pet.level.maximum = proto.maxLevelPerAscension[pet.rating];
    };
    PetHelper.prototype.syncPetBasedOnProto = function (pet) {
        var proto = this.getPetProto(pet.typeName);
        this.syncPetNextUpgradeCost(pet);
        pet.gold.__current = pet.gold.__current || 0;
        pet.gold.maximum = this.getPetUpgradeValue(pet, interfaces_1.PetUpgrade.GoldStorage);
        pet.permanentUpgrades = Object.assign({}, proto.permanentUpgrades);
        this.syncMaxLevel(pet);
        this.syncPetEquipmentSlots(pet);
        this.syncBasePetStats(pet);
        this.syncPetAttribute(pet);
        this.syncPetAffinity(pet);
        this.syncPetAscMats(pet);
    };
    PetHelper.prototype.shareSoul = function (pet) {
        var player = pet.$$player;
        player.$inventory.unequipItem(player.$inventory.itemInEquipmentSlot(interfaces_1.ItemSlot.Soul));
        var soulItem = this.petSoulForScale(pet);
        if (!soulItem)
            return;
        player.$inventory.equipItem(soulItem);
        player.recalculateStats();
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", asset_manager_1.AssetManager)
    ], PetHelper.prototype, "assets", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", rng_service_1.RNGService)
    ], PetHelper.prototype, "rng", void 0);
    PetHelper = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], PetHelper);
    return PetHelper;
}());
exports.PetHelper = PetHelper;
//# sourceMappingURL=pet-helper.js.map