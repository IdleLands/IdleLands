"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var restricted_number_1 = require("restricted-number");
var nonenumerable_1 = require("nonenumerable");
var Item_1 = require("./Item");
var interfaces_1 = require("../interfaces");
var Pet = /** @class */ (function () {
    function Pet() {
    }
    Object.defineProperty(Pet.prototype, "$$game", {
        get: function () {
            return this.$game;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pet.prototype, "$$player", {
        get: function () {
            return this.$player;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pet.prototype, "currentStats", {
        get: function () {
            return this.stats;
        },
        enumerable: true,
        configurable: true
    });
    Pet.prototype.init = function () {
        var _this = this;
        // validate that important properties exist
        if (!this.level)
            this.level = new restricted_number_1.RestrictedNumber(1, 100, 1);
        if (!this.xp)
            this.xp = new restricted_number_1.RestrictedNumber(0, 100, 0);
        if (!this.gender)
            this.gender = 'male';
        if (!this.gold)
            this.gold = new restricted_number_1.RestrictedNumber(0, 0, 0);
        if (!this.rating)
            this.rating = 0;
        if (!this.stats)
            this.stats = {};
        if (!this.$statTrail)
            this.$statTrail = {};
        if (!this.upgradeLevels)
            this.upgradeLevels = {};
        if (!this.equipment)
            this.equipment = {};
        if (!this.gatherTick && this.upgradeLevels[interfaces_1.PetUpgrade.GatherTime])
            this.updateGatherTick();
        if (!this.affinity)
            this.affinity = lodash_1.sample(Object.values(interfaces_1.PetAffinity));
        if (!this.attribute)
            this.attribute = interfaces_1.PetAttribute.Cursed;
        // reset some aspects
        this.level = new restricted_number_1.RestrictedNumber(this.level.minimum, this.level.maximum, this.level.__current);
        this.xp = new restricted_number_1.RestrictedNumber(this.xp.minimum, this.xp.maximum, this.xp.__current);
        this.gold = new restricted_number_1.RestrictedNumber(this.gold.minimum, this.gold.maximum, this.gold.__current);
        Object.values(interfaces_1.PetUpgrade).forEach(function (upgrade) {
            _this.upgradeLevels[upgrade] = _this.upgradeLevels[upgrade] || 0;
        });
        Object.keys(this.equipment).forEach(function (itemSlot) {
            _this.equipment[itemSlot] = _this.equipment[itemSlot].map(function (item) {
                if (!item)
                    return;
                var itemRef = new Item_1.Item();
                itemRef.init(item);
                return itemRef;
            });
        });
        this.recalculateStats();
    };
    Pet.prototype.toSaveObject = function () {
        return lodash_1.pickBy(this, function (value, key) { return !key.startsWith('$') && key !== 'currentStats'; });
    };
    Pet.prototype.loop = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.gainXP(0);
                this.gainGold(0);
                if (this.gatherTick && Date.now() > this.gatherTick) {
                    this.doFind();
                    this.updateGatherTick();
                }
                return [2 /*return*/];
            });
        });
    };
    Pet.prototype.getStat = function (stat) {
        return this.stats[stat];
    };
    Pet.prototype.canLevelUp = function () {
        return !this.level.atMaximum();
    };
    Pet.prototype.gainXP = function (xp, addMyXP) {
        if (xp === void 0) { xp = 0; }
        if (addMyXP === void 0) { addMyXP = true; }
        var remainingXP = addMyXP ? Math.floor(xp + this.stats.xp) : xp;
        var totalXP = remainingXP;
        if (remainingXP < 0) {
            this.xp.add(remainingXP);
            return remainingXP;
        }
        while (remainingXP > 0 && this.canLevelUp()) {
            var preAddXP = this.xp.total;
            this.xp.add(remainingXP);
            var xpDiff = this.xp.total - preAddXP;
            remainingXP -= xpDiff;
            this.tryLevelUp();
        }
        return totalXP;
    };
    Pet.prototype.spendGold = function (gold) {
        if (gold === void 0) { gold = 0; }
        return this.gainGold(-gold);
    };
    Pet.prototype.gainGold = function (gold, addMyGold) {
        if (gold === void 0) { gold = 0; }
        if (addMyGold === void 0) { addMyGold = true; }
        var remainingGold = addMyGold ? Math.floor(gold + this.stats.gold) : gold;
        if (remainingGold < 0) {
            this.gold.add(remainingGold);
            return remainingGold;
        }
        this.gold.add(remainingGold);
        return remainingGold;
    };
    Pet.prototype.tryLevelUp = function () {
        if (!this.xp.atMaximum())
            return;
        this.level.add(1);
        this.xp.toMinimum();
        this.resetMaxXP();
    };
    Pet.prototype.resetMaxXP = function () {
        this.xp.maximum = this.$$game.calculatorHelper.calcLevelMaxXP(this.level.total);
    };
    Pet.prototype.addStatTrail = function (stat, val, reason) {
        if (val === 0 || stat === interfaces_1.Stat.SPECIAL)
            return;
        val = Math.floor(val);
        if (isNaN(val) || !isFinite(val))
            return;
        this.stats[stat] = this.stats[stat] || 0;
        this.stats[stat] += val;
        this.$statTrail[stat] = this.$statTrail[stat] || [];
        this.$statTrail[stat].push({ val: val, reason: reason });
    };
    Pet.prototype.recalculateStats = function () {
        var _this = this;
        if (!this.$affinity || !this.$player)
            return;
        this.stats = {};
        // dynamically-calculated
        // first, we do the addition-based adds
        var allStats = Object.keys(interfaces_1.Stat).map(function (key) { return interfaces_1.Stat[key]; });
        allStats.forEach(function (stat) {
            _this.stats[stat] = _this.stats[stat] || 0;
            Object.keys(_this.equipment).forEach(function (itemSlot) {
                _this.equipment[itemSlot].forEach(function (item) {
                    if (!item || !item.stats[stat])
                        return;
                    _this.addStatTrail(stat, item.stats[stat], "Item: " + item.name);
                });
            });
            Object.keys(_this.$player.buffWatches).forEach(function (buffKey) {
                _this.$player.buffWatches[buffKey].forEach(function (buff) {
                    if (!buff.stats || !buff.stats[stat] || !buff.booster)
                        return;
                    _this.addStatTrail(stat, buff.stats[stat], "Player Buff: " + buff.name);
                });
            });
            var profBasePerLevel = _this.$affinity.calcLevelStat(_this.level.total, stat);
            _this.addStatTrail(stat, profBasePerLevel, _this.affinity + ": Base / Lv. (" + profBasePerLevel / _this.level.total + ")");
            // make sure it is 0. no super negatives.
            _this.stats[stat] = Math.max(0, _this.stats[stat]);
            var statBase = _this.stats[stat];
            // stat profession multiplier boost
            var profMult = _this.$affinity.calcStatMultiplier(stat);
            if (profMult > 1) {
                var addedValue = Math.floor((statBase * profMult)) - statBase;
                _this.addStatTrail(stat, addedValue, _this.affinity + " Mult. (" + profMult.toFixed(1) + "x)");
            }
            else if (profMult < 1) {
                var lostValue = statBase - Math.floor(statBase * profMult);
                _this.addStatTrail(stat, -lostValue, _this.affinity + " Mult. (" + profMult.toFixed(1) + "x)");
            }
        });
        var copyStats = lodash_1.clone(this.stats);
        allStats.forEach(function (checkStat) {
            var profBoosts = _this.$affinity.calcStatsForStats(copyStats, checkStat);
            profBoosts.forEach(function (_a) {
                var stat = _a.stat, boost = _a.boost, tinyBoost = _a.tinyBoost;
                _this.addStatTrail(checkStat, boost, _this.affinity + " " + checkStat.toUpperCase() + " / " + stat.toUpperCase() + " (" + tinyBoost + ")");
            });
        });
        // base values
        this.stats.hp = Math.max(1, this.stats.hp);
        this.stats.xp = Math.max(1, this.stats.xp);
        this.stats.gold = Math.max(1, this.stats.gold);
    };
    Pet.prototype.findEquippedItemById = function (itemSlot, itemId) {
        return lodash_1.find(this.equipment[itemSlot], { id: itemId });
    };
    Pet.prototype.equip = function (item) {
        if (this.equipment[item.type].every(function (x) { return !!x; })) {
            return false;
        }
        // push the new item to the beginning and pop an empty
        this.equipment[item.type].unshift(item);
        this.equipment[item.type].pop();
        this.recalculateStats();
        return true;
    };
    Pet.prototype.unequip = function (item) {
        lodash_1.pull(this.equipment[item.type], item);
        this.equipment[item.type].push(null);
        this.$$game.petHelper.syncPetEquipmentSlots(this);
        this.recalculateStats();
        return true;
    };
    Pet.prototype.unequipAll = function () {
        this.equipment = {};
        this.$$game.petHelper.syncPetBasedOnProto(this);
        this.recalculateStats();
    };
    Pet.prototype.sellItem = function (item) {
        var value = item.score;
        var modValue = this.gainGold(value);
        return modValue;
    };
    Pet.prototype.doUpgrade = function (upgrade) {
        this.upgradeLevels[upgrade]++;
        if (upgrade === interfaces_1.PetUpgrade.GatherTime) {
            this.updateGatherTick();
        }
    };
    Pet.prototype.updateGatherTick = function () {
        if (!this.$$game)
            return;
        var tickValue = this.$$game.petHelper.getPetUpgradeValue(this, interfaces_1.PetUpgrade.GatherTime);
        if (!tickValue)
            return;
        this.gatherTick = Date.now() + (tickValue * 1000);
    };
    Pet.prototype.doFind = function () {
        var ilpFind = this.$$game.petHelper.getPetUpgradeValue(this, interfaces_1.PetUpgrade.ILPGatherQuantity);
        var itemFindLevelBoost = this.$$game.petHelper.getPetUpgradeValue(this, interfaces_1.PetUpgrade.ItemFindLevelBoost);
        var itemFindQualityBoost = this.$$game.petHelper.getPetUpgradeValue(this, interfaces_1.PetUpgrade.ItemFindQualityBoost);
        var itemFindPercentBoostStat = this.$$game.petHelper.getPetUpgradeValue(this, interfaces_1.PetUpgrade.ItemFindLevelPercent) / 100;
        var itemFindPercentBoost = Math.floor(this.$player.level.total * itemFindPercentBoostStat);
        var foundItem = this.$$game.itemGenerator.generateItemForPlayer(this.$player, {
            generateLevel: this.level.total + itemFindLevelBoost + itemFindPercentBoost, qualityBoost: itemFindQualityBoost
        });
        this.$player.gainILP(ilpFind);
        this.$$game.eventManager.doEventFor(this.$player, interfaces_1.EventName.FindItem, { fromPet: true, item: foundItem });
    };
    Pet.prototype.ascend = function () {
        this.rating++;
    };
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        tslib_1.__metadata("design:type", Object)
    ], Pet.prototype, "$game", void 0);
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        tslib_1.__metadata("design:type", Object)
    ], Pet.prototype, "$player", void 0);
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        tslib_1.__metadata("design:type", Object)
    ], Pet.prototype, "$party", void 0);
    return Pet;
}());
exports.Pet = Pet;
//# sourceMappingURL=Pet.js.map