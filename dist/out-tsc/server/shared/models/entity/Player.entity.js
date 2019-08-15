"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var lodash_1 = require("lodash");
var restricted_number_1 = require("restricted-number");
var nonenumerable_1 = require("nonenumerable");
var Statistics_entity_1 = require("./Statistics.entity");
var Inventory_entity_1 = require("./Inventory.entity");
var Choices_entity_1 = require("./Choices.entity");
var Profession_1 = require("../../../server/core/game/professions/Profession");
var interfaces_1 = require("../../interfaces");
var shared_fields_1 = require("../../../server/core/game/shared-fields");
var Achievements_entity_1 = require("./Achievements.entity");
var Personalities_entity_1 = require("./Personalities.entity");
var Collectibles_entity_1 = require("./Collectibles.entity");
var Pets_entity_1 = require("./Pets.entity");
var Premium_entity_1 = require("./Premium.entity");
// 5 minutes on prod, 5 seconds on dev
var STAMINA_TICK_BOOST = process.env.NODE_ENV === 'production' ? 300000 : 5000;
/**
 * Note: some attributes are @nonenumerable, while others are prefixed with $.
 * @nonenumerable attributes are not sending updates to the client, and they also do not get sent to the DB.
 * $ attributes are not saved to the DB, but are sent to the client unless marked with @nonenumerable.
 *
 * To save a @nonenumerable attr to the DB, DatabaseManager#savePlayer must be updated to manually copy these fields.
 * $ attributes should never be saved to the DB, and are prefixed as such because it directly conflicts with MongoDB.
 *
 * Sadly, getters just don't work.
 */
var Player = /** @class */ (function () {
    function Player() {
    }
    Object.defineProperty(Player.prototype, "$$game", {
        get: function () {
            return this.$game;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "currentStats", {
        get: function () {
            return this.stats;
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.init = function () {
        var _this = this;
        // validate that important properties exist
        if (!this.createdAt)
            this.createdAt = Date.now();
        if (!this.availableGenders)
            this.availableGenders = ['male', 'female', 'not a bear', 'glowcloud', 'astronomical entity', 'soap'];
        if (!this.availableTitles)
            this.availableTitles = [];
        if (!this.level)
            this.level = new restricted_number_1.RestrictedNumber(1, 100, 1);
        if (!this.xp)
            this.xp = new restricted_number_1.RestrictedNumber(0, 100, 0);
        if (!this.profession)
            this.profession = interfaces_1.Profession.Generalist;
        if (!this.gender)
            this.gender = lodash_1.sample(this.availableGenders);
        if (!this.map)
            this.map = 'Norkos';
        if (!this.x)
            this.x = 10;
        if (!this.y)
            this.y = 10;
        if (!this.ascensionLevel)
            this.ascensionLevel = 0;
        if (!this.gold)
            this.gold = 0;
        if (!this.stamina)
            this.stamina = new restricted_number_1.RestrictedNumber(0, 10, 10);
        if (!this.nextStaminaTick)
            this.nextStaminaTick = Date.now();
        if (!this.stats)
            this.stats = {};
        if (!this.$statTrail)
            this.$statTrail = {};
        if (!this.buffWatches)
            this.buffWatches = {};
        if (!this.cooldowns)
            this.cooldowns = {};
        delete this.bossTimers;
        delete this.buffWatches['undefined'];
        this.clearOldCooldowns();
        if (!this.$profession) {
            this.changeProfessionWithRef(this.profession);
        }
        // init the prototypes that exist
        shared_fields_1.SHARED_FIELDS.forEach(function (_a) {
            var name = _a.name, proto = _a.proto;
            if (_this["$" + name])
                return;
            _this["$" + name] = new proto();
            _this["$" + name].setOwner(_this);
        });
        // reset some aspects
        this.level = new restricted_number_1.RestrictedNumber(this.level.minimum, this.level.maximum, this.level.__current);
        this.xp = new restricted_number_1.RestrictedNumber(this.xp.minimum, this.xp.maximum, this.xp.__current);
        this.stamina = new restricted_number_1.RestrictedNumber(this.stamina.minimum, this.stamina.maximum, this.stamina.__current);
        this.calculateStamina();
        this.checkStaminaTick();
        // init extra data for relevant joined services
        this.$professionData = this.$profession.$professionData;
        this.initLinks();
        // copy all the data to us
        this.copyLinkedDataToSelf();
        this.increaseStatistic('Game/Logins', 1);
        this.recalculateStats();
        this.syncPremium();
    };
    Player.prototype.clearOldCooldowns = function () {
        var _this = this;
        var now = Date.now();
        Object.keys(this.cooldowns).forEach(function (cooldown) {
            if (_this.cooldowns[cooldown] > now)
                return;
            delete _this.cooldowns[cooldown];
        });
    };
    Player.prototype.copyLinkedDataToSelf = function () {
        var _this = this;
        shared_fields_1.SHARED_FIELDS.forEach(function (_a) {
            var name = _a.name;
            _this["$" + name + "Data"] = _this["$" + name]["$" + name + "Data"];
        });
    };
    Player.prototype.toSaveObject = function () {
        return lodash_1.pickBy(this, function (value, key) { return !key.startsWith('$'); });
    };
    Player.prototype.fullName = function () {
        if (this.title)
            return this.name + ", the " + this.title;
        return this.name;
    };
    Player.prototype.loop = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.increaseStatistic('Character/Ticks', 1);
                this.gainXP(0);
                this.gainGold(0);
                this.checkStaminaTick();
                this.$game.movementHelper.takeStep(this);
                this.$game.eventManager.tryToDoEventFor(this);
                if (this.divineDirection) {
                    this.divineDirection.steps--;
                    if (this.divineDirection.steps <= 0)
                        this.divineDirection = null;
                }
                if (this.mutedUntil < Date.now())
                    this.mutedUntil = 0;
                this.$pets.loop();
                this.$game.playerManager.updatePlayer(this);
                return [2 /*return*/];
            });
        });
    };
    Player.prototype.getStat = function (stat) {
        return this.stats[stat];
    };
    Player.prototype.oocAction = function () {
        if (this.stamina.total < this.$profession.oocAbilityCost)
            return;
        this.increaseStatistic('Character/Stamina/Spend', this.$profession.oocAbilityCost);
        this.increaseStatistic("Profession/" + this.profession + "/AbilityUses", 1);
        this.stamina.sub(this.$profession.oocAbilityCost);
        return this.$profession.oocAbility(this);
    };
    Player.prototype.petOOCAction = function () {
        if (this.stamina.total < this.$pets.$activePet.$attribute.oocAbilityCost)
            return;
        this.increaseStatistic('Character/Stamina/Spend', this.$pets.$activePet.$attribute.oocAbilityCost);
        this.increaseStatistic("Pet/AbilityUses/Total", 1);
        this.increaseStatistic("Pet/AbilityUses/Attribute/" + this.$pets.$activePet.attribute, 1);
        this.increaseStatistic("Pet/AbilityUses/Pet/" + this.$pets.$activePet.typeName, 1);
        this.stamina.sub(this.$pets.$activePet.$attribute.oocAbilityCost);
        return this.$pets.$activePet.$attribute.oocAbility(this);
    };
    Player.prototype.canLevelUp = function () {
        return !this.level.atMaximum();
    };
    Player.prototype.gainXP = function (xp, addMyXP) {
        if (xp === void 0) { xp = 0; }
        if (addMyXP === void 0) { addMyXP = true; }
        var isNegative = xp < 0;
        var remainingXP = addMyXP ? Math.floor(xp + this.stats.xp) : xp;
        if (remainingXP > 0 && isNegative)
            remainingXP = -1;
        var totalXP = remainingXP;
        if (remainingXP < 0) {
            this.xp.add(remainingXP);
            this.increaseStatistic('Character/Experience/Lose', -remainingXP);
            return remainingXP;
        }
        // always gain profession xp, even if you are level blocked
        this.increaseStatistic("Profession/" + this.profession + "/Experience", remainingXP);
        while (remainingXP > 0 && this.canLevelUp()) {
            this.increaseStatistic('Character/Experience/Gain', remainingXP);
            var preAddXP = this.xp.total;
            this.xp.add(remainingXP);
            var xpDiff = this.xp.total - preAddXP;
            remainingXP -= xpDiff;
            this.tryLevelUp();
        }
        return totalXP;
    };
    Player.prototype.spendGold = function (gold) {
        if (gold === void 0) { gold = 0; }
        this.increaseStatistic('Character/Gold/Spend', gold);
        return this.gainGold(-gold);
    };
    Player.prototype.gainGold = function (gold, addMyGold) {
        if (gold === void 0) { gold = 0; }
        if (addMyGold === void 0) { addMyGold = true; }
        var isNegative = gold < 0;
        var remainingGold = addMyGold ? Math.floor(gold + this.stats.gold) : gold;
        if (remainingGold > 0 && isNegative)
            remainingGold = -1;
        if (remainingGold < 0) {
            this.gold += remainingGold;
            this.increaseStatistic('Character/Gold/Lose', -remainingGold);
            this.gold = Math.max(0, this.gold);
            return remainingGold;
        }
        this.increaseStatistic('Character/Gold/Gain', remainingGold);
        this.gold += remainingGold;
        return remainingGold;
    };
    Player.prototype.ascend = function () {
        var _this = this;
        if (this.canLevelUp())
            return;
        this.lastAscension = Date.now();
        this.ascensionLevel = this.ascensionLevel || 0;
        this.ascensionLevel++;
        this.level.minimum = 1;
        this.level.set(1);
        this.xp.set(0);
        this.xp.maximum = this.$$game.calculatorHelper.calcLevelMaxXP(1);
        this.gainILP(this.level.maximum);
        this.increaseStatistic('Character/Ascension/Levels', this.level.maximum);
        this.level.maximum = this.level.maximum + (this.ascensionLevel * 10);
        this.increaseStatistic('Character/Ascension/Gold', this.gold);
        Object.values(this.$petsData.allPets).forEach(function (pet) { return pet.gold.set(0); });
        this.gold = 0;
        this.increaseStatistic('Character/Ascension/ItemScore', this.$inventory.totalItemScore());
        var items = this.$game.itemGenerator.generateNewbieItems();
        items.forEach(function (item) { return _this.$inventory.equipItem(item); });
        this.$inventory.clearInventory();
        this.increaseStatistic('Character/Ascension/Collectibles', this.$collectibles.getFoundOwnedCollectibles().length);
        this.$collectibles.resetFoundAts();
        this.$choices.removeAllChoices();
        this.increaseStatistic('Character/Ascension/Times', 1);
        this.$pets.resetEquipment();
        this.$$game.festivalManager.startAscensionFestival(this);
        this.setPos(10, 10, 'Norkos', 'Norkos Town');
        this.recalculateStats();
    };
    Player.prototype.checkStaminaTick = function () {
        if (this.stamina.atMaximum()) {
            this.nextStaminaTick = Date.now();
        }
        if (this.stamina.atMaximum() || Date.now() < this.nextStaminaTick)
            return;
        this.increaseStatistic('Character/Stamina/Gain', 1);
        this.stamina.add(1);
        this.nextStaminaTick = this.nextStaminaTick + (STAMINA_TICK_BOOST * (this.$premiumData && this.$premiumData.tier ? 0.8 : 1));
        if (Date.now() > this.nextStaminaTick)
            this.checkStaminaTick();
    };
    Player.prototype.calculateStamina = function () {
        var level = this.level.total;
        // base of 8 (because you start level 1, which is a free +2)
        var staminaTotal = 8;
        // +2 stamina for the first 20 levels
        staminaTotal += Math.max(1, Math.min(level, 20)) * 2;
        // +1 stamina for levels 21-80
        staminaTotal += Math.max(0, Math.min(level - 20, 80));
        // 0.5 stamina for levels 100-200
        staminaTotal += Math.floor(Math.max(0, Math.min(level - 100, 100)) * 0.5);
        // ascensionLevel^2 bonus to stamina
        staminaTotal += this.ascensionLevel * this.ascensionLevel;
        // the permanent boosted upgrade value
        staminaTotal += this.$statistics.get('Game/Premium/Upgrade/MaxStaminaBoost');
        this.stamina.maximum = staminaTotal;
    };
    Player.prototype.tryLevelUp = function () {
        if (!this.xp.atMaximum())
            return;
        this.level.add(1);
        this.gainILP(1);
        this.xp.toMinimum();
        this.resetMaxXP();
        this.increaseStatistic('Character/Experience/Levels', 1);
        this.calculateStamina();
        this.$$game.sendClientUpdateForPlayer(this);
    };
    Player.prototype.resetMaxXP = function () {
        this.xp.maximum = this.$$game.calculatorHelper.calcLevelMaxXP(this.level.total);
    };
    Player.prototype.addStatTrail = function (stat, val, reason) {
        if (val === 0)
            return;
        val = Math.floor(val);
        if (isNaN(val) || !isFinite(val))
            return;
        this.stats[stat] = this.stats[stat] || 0;
        this.stats[stat] += val;
        this.$statTrail[stat] = this.$statTrail[stat] || [];
        this.$statTrail[stat].push({ val: val, reason: reason });
    };
    Player.prototype.recalculateStats = function () {
        var _this = this;
        if (!this.$inventoryData)
            return;
        this.stats = {};
        this.$statTrail = {};
        this.stats.specialName = this.$profession.specialStatName || '';
        // dynamically-calculated
        // first, we do the addition-based adds
        var allStats = Object.keys(interfaces_1.Stat).map(function (key) { return interfaces_1.Stat[key]; });
        allStats.forEach(function (stat) {
            _this.stats[stat] = _this.stats[stat] || 0;
            // stats per level boost
            var profBasePerLevel = _this.$profession.calcLevelStat(_this.level.total, stat);
            _this.addStatTrail(stat, profBasePerLevel, _this.profession + ": Base / Lv. (" + (profBasePerLevel / _this.level.total).toFixed(1) + ")");
            // item adds
            Object.keys(_this.$inventoryData.equipment).forEach(function (itemSlot) {
                var item = _this.$inventory.itemInEquipmentSlot(itemSlot);
                if (!item || !item.stats[stat])
                    return;
                _this.addStatTrail(stat, item.stats[stat], "Item: " + item.name);
            });
            // achievement adds
            Object.keys(_this.$achievementsData.achievements).forEach(function (achName) {
                var ach = _this.$achievementsData.achievements[achName];
                ach.rewards.forEach(function (reward) {
                    if (reward.type !== interfaces_1.AchievementRewardType.Stats || !reward.stats[stat])
                        return;
                    _this.addStatTrail(stat, reward.stats[stat], "Achieve#: " + achName + " (t" + ach.tier + ")");
                });
            });
            // buff adds
            Object.keys(_this.buffWatches).forEach(function (buffKey) {
                _this.buffWatches[buffKey].forEach(function (buff) {
                    if (!buff.stats || !buff.stats[stat])
                        return;
                    _this.addStatTrail(stat, buff.stats[stat], (buff.booster ? 'Booster' : 'Injury') + ": " + buff.name);
                });
            });
            // make sure it is 0. no super negatives.
            _this.stats[stat] = Math.max(0, _this.stats[stat]);
        });
        var personalityInstances = this.getActivePersonalityInstances();
        // here we do the multiplicative adds
        allStats.forEach(function (stat) {
            var statBase = _this.stats[stat];
            // stat profession multiplier boost
            var profMult = _this.$profession.calcStatMultiplier(stat);
            if (profMult > 1) {
                var addedValue = Math.floor((statBase * profMult)) - statBase;
                _this.addStatTrail(stat, addedValue, _this.profession + " Mult. (" + profMult.toFixed(1) + "x)");
            }
            else if (profMult < 1) {
                var lostValue = statBase - Math.floor(statBase * profMult);
                _this.addStatTrail(stat, -lostValue, _this.profession + " Mult. (" + profMult.toFixed(1) + "x)");
            }
            // achievement multiplier boost
            Object.keys(_this.$achievementsData.achievements).forEach(function (achName) {
                var ach = _this.$achievementsData.achievements[achName];
                ach.rewards.forEach(function (reward) {
                    if (reward.type !== interfaces_1.AchievementRewardType.StatMultipliers || !reward.stats[stat])
                        return;
                    var addedValue = Math.floor((statBase * reward.stats[stat])) - statBase;
                    _this.addStatTrail(stat, addedValue, "Achieve%: " + achName + " (t" + ach.tier + ")");
                });
            });
            // personality multiplier boost
            personalityInstances.forEach(function (pers) {
                if (!pers.statMultipliers || !pers.statMultipliers[stat])
                    return;
                var addedValue = Math.floor((statBase * pers.statMultipliers[stat])) - statBase;
                _this.addStatTrail(stat, addedValue, "Personality: " + pers.name);
            });
            // festivals
            if (stat !== interfaces_1.Stat.SPECIAL) {
                _this.addStatTrail(stat, Math.floor(statBase * _this.$$game.festivalManager.getMultiplier(stat)), 'Festivals');
            }
        });
        // next we do specific-adds from the profession
        // we do these last, despite being additive, because they rely heavily on the stats from before
        var copyStats = lodash_1.clone(this.stats);
        allStats.forEach(function (checkStat) {
            var profBoosts = _this.$profession.calcStatsForStats(copyStats, checkStat);
            profBoosts.forEach(function (_a) {
                var stat = _a.stat, boost = _a.boost, tinyBoost = _a.tinyBoost;
                _this.addStatTrail(checkStat, boost, _this.profession + " " + checkStat.toUpperCase() + " / " + stat.toUpperCase() + " (" + tinyBoost + ")");
            });
        });
        // base values
        this.stats.hp = Math.max(1, this.stats.hp);
        this.stats.xp = Math.max(1, this.stats.xp);
        this.stats.gold = Math.max(0, this.stats.gold);
    };
    Player.prototype.initLinks = function () {
        var _this = this;
        this.$inventory.init(this);
        if (this.$inventory.isNeedingNewbieItems()) {
            var items = this.$game.itemGenerator.generateNewbieItems();
            items.forEach(function (item) { return _this.equip(item); });
        }
        this.$achievements.init(this);
        this.$choices.init(this);
        this.$pets.init(this);
        this.$game.achievementManager.syncAchievements(this);
        this.syncTitles();
        this.syncGenders();
        this.syncPersonalities();
    };
    Player.prototype.equip = function (item, failOnInventoryFull) {
        if (failOnInventoryFull === void 0) { failOnInventoryFull = true; }
        var oldItem = this.$inventory.itemInEquipmentSlot(item.type);
        if (oldItem) {
            var successful = this.unequip(oldItem, failOnInventoryFull);
            if (!successful)
                return false;
        }
        this.increaseStatistic('Item/Equip/Times', 1);
        this.$inventory.equipItem(item);
        this.recalculateStats();
        return true;
    };
    // primarily used for providences
    Player.prototype.forceUnequip = function (item) {
        this.$inventory.unequipItem(item);
        this.recalculateStats();
    };
    Player.prototype.unequip = function (item, failOnInventoryFull) {
        if (failOnInventoryFull === void 0) { failOnInventoryFull = false; }
        if (failOnInventoryFull && !this.$inventory.canAddItemsToInventory())
            return false;
        this.$inventory.unequipItem(item);
        this.recalculateStats();
        this.increaseStatistic('Item/Unequip/Times', 1);
        if (this.$inventory.canAddItemsToInventory()) {
            this.$inventory.addItemToInventory(item);
        }
        else {
            this.sellItem(item);
        }
        return true;
    };
    Player.prototype.alwaysTryAddToInventory = function (item) {
        // if we cannot add to inventory
        if (!this.$inventory.canAddItemsToInventory()) {
            // check for any number of unlocked items we can sell
            var unlocked = this.$inventory.unlockedItems();
            // if we find one, sell it
            if (unlocked.length > 0) {
                this.$inventory.removeItemFromInventory(unlocked[0]);
                this.sellItem(unlocked[0]);
                this.$inventory.addItemToInventory(item);
                return;
            }
            // if we can't find anything, just sell it
            this.sellItem(item);
            return;
        }
        // if we have space, obviously just add it
        this.$inventory.addItemToInventory(item);
    };
    Player.prototype.sellItem = function (item) {
        var value = item.score > 10 ? item.score : 10;
        var modValue = this.gainGold(value);
        this.increaseStatistic('Item/Sell/Times', 1);
        this.increaseStatistic('Item/Sell/GoldGain', modValue);
        return modValue;
    };
    Player.prototype.doChoice = function (choice, decisionIndex) {
        var decision = choice.choices[decisionIndex];
        var shouldRemove = this.$game.eventManager.doChoiceFor(this, choice, decision);
        this.$choices.makeDecision(this, choice, decisionIndex, shouldRemove);
    };
    Player.prototype.emit = function (evt, data) {
        this.$game.playerManager.emitToPlayer(this.name, evt, data);
    };
    Player.prototype.increaseStatistic = function (stat, val) {
        this.$statistics.increase(stat, val);
        this.checkAchievements(stat);
        this.checkBuffs(stat);
    };
    Player.prototype.checkAchievements = function (stat) {
        var _this = this;
        var newAchievements = this.$game.achievementManager.checkAchievementsFor(this, stat);
        if (newAchievements.length > 0) {
            this.recalculateStats();
            newAchievements.forEach(function (ach) {
                var messageData = {
                    when: Date.now(),
                    type: interfaces_1.AdventureLogEventType.Achievement,
                    message: _this.fullName() + " has achieved " + ach.name + " tier " + ach.tier + "!"
                };
                _this.$game.subscriptionManager.emitToChannel(interfaces_1.Channel.PlayerAdventureLog, { playerNames: [_this.name], data: messageData });
            });
            this.syncTitles();
            this.syncGenders();
            this.syncPersonalities();
            this.syncPremium();
            this.$pets.syncBuyablePets(this);
        }
    };
    Player.prototype.checkBuffs = function (stat) {
        var _this = this;
        var shouldRecalc = false;
        var allBuffWatches = this.buffWatches[stat];
        if (allBuffWatches) {
            allBuffWatches.forEach(function (buff) {
                buff.duration--;
                if (buff.duration <= 0) {
                    _this.buffWatches[stat] = lodash_1.without(allBuffWatches, buff);
                    shouldRecalc = true;
                }
            });
            if (this.buffWatches[stat].length === 0)
                delete this.buffWatches[stat];
        }
        if (shouldRecalc) {
            this.recalculateStats();
        }
    };
    Player.prototype.togglePersonality = function (pers) {
        if (!this.$personalities.has(pers))
            return false;
        this.$personalities.toggle(this.$game.personalityManager.get(pers));
        this.recalculateStats();
        return true;
    };
    Player.prototype.getDefaultChoice = function (choices) {
        if (this.$personalities.isActive('Denier') && lodash_1.includes(choices, 'No'))
            return 'No';
        if (this.$personalities.isActive('Affirmer') && lodash_1.includes(choices, 'Yes'))
            return 'Yes';
        if (this.$personalities.isActive('Indecisive'))
            return lodash_1.sample(choices);
        return 'Yes';
    };
    Player.prototype.hasPersonality = function (pers) {
        return this.$personalities.has(pers);
    };
    Player.prototype.getPersonalityInstances = function () {
        var _this = this;
        return this.$achievements.getPersonalities().map(function (pers) { return _this.$game.personalityManager.get(pers); });
    };
    Player.prototype.getActivePersonalityInstances = function () {
        var _this = this;
        return this.getPersonalityInstances().filter(function (pers) { return _this.$personalities.isActive(pers.name); });
    };
    Player.prototype.syncTitles = function () {
        this.availableTitles = this.$achievements.getTitles();
    };
    Player.prototype.syncGenders = function () {
        this.availableGenders = this.$achievements.getGenders();
    };
    Player.prototype.syncPersonalities = function () {
        this.$personalities.resetPersonalitiesTo(this.getPersonalityInstances());
    };
    Player.prototype.syncIL3 = function (stats) {
        var _this = this;
        this.$statistics.set('Game/IdleLands2/Played', stats.Ancient ? 1 : 0);
        this.$statistics.set('Game/IdleLands3/Played', stats ? 1 : 0);
        this.$statistics.set('Game/IdleLands3/Donator', stats.Donator ? 1 : 0);
        this.$statistics.set('Game/IdleLands3/Contributor', stats.Contributor ? 1 : 0);
        this.$statistics.set('Game/IdleLands3/Ascensions', stats.Ascensions || 0);
        this.$statistics.set('Game/IdleLands3/Wolfmaster', stats.Wolfmaster ? 1 : 0);
        this.$statistics.set('Game/IdleLands3/Spiritualist', stats.Spiritualist ? 1 : 0);
        this.$statistics.set('Game/IdleLands3/Anniversary', stats.Anniversary || 0);
        this.checkAchievements('Game/IdleLands2/Played');
        ['Played', 'Donator', 'Contributor', 'Ascensions', 'Wolfmaster', 'Spiritualist', 'Anniversary'].forEach(function (stat) {
            _this.checkAchievements("Game/IdleLands3/" + stat);
        });
    };
    Player.prototype.syncPremium = function () {
        var _this = this;
        if (!this.$premiumData)
            return;
        var collabTier = this.$statistics.get('Game/Contributor/ContributorTier');
        this.$statistics.set('Game/Contributor/ContributorTier', collabTier);
        this.checkAchievements('Game/Contributor/ContributorTier');
        var tier = this.$premiumData.tier + collabTier;
        var allAchievementBoosts = this.$achievements.getPermanentUpgrades();
        var allBuffBoosts = {};
        Object.keys(this.buffWatches).forEach(function (buffKey) {
            _this.buffWatches[buffKey].forEach(function (buff) {
                if (!buff.permanentStats)
                    return;
                Object.keys(buff.permanentStats).forEach(function (permanent) {
                    allBuffBoosts[permanent] = allBuffBoosts[permanent] || 0;
                    allBuffBoosts[permanent] += buff.permanentStats[permanent];
                });
            });
        });
        this.$statistics.set('Game/Premium/Tier', tier);
        this.checkAchievements('Game/Premium/Tier');
        this.$statistics.set('Game/Premium/Upgrade/AdventureLogSize', 25
            + (allBuffBoosts[interfaces_1.PermanentUpgrade.AdventureLogSizeBoost] || 0)
            + (allAchievementBoosts[interfaces_1.PermanentUpgrade.AdventureLogSizeBoost] || 0)
            + (tier * 25)
            + this.$pets.getTotalPermanentUpgradeValue(interfaces_1.PermanentUpgrade.AdventureLogSizeBoost)
            + this.$premium.getUpgradeLevel(interfaces_1.PermanentUpgrade.AdventureLogSizeBoost));
        this.$statistics.set('Game/Premium/Upgrade/InventorySize', 10
            + (allBuffBoosts[interfaces_1.PermanentUpgrade.InventorySizeBoost] || 0)
            + (allAchievementBoosts[interfaces_1.PermanentUpgrade.InventorySizeBoost] || 0)
            + (tier * 10)
            + this.$pets.getTotalPermanentUpgradeValue(interfaces_1.PermanentUpgrade.InventorySizeBoost)
            + this.$premium.getUpgradeLevel(interfaces_1.PermanentUpgrade.InventorySizeBoost));
        this.$statistics.set('Game/Premium/Upgrade/BuffScrollDuration', 0
            + (allBuffBoosts[interfaces_1.PermanentUpgrade.BuffScrollDuration] || 0)
            + (allAchievementBoosts[interfaces_1.PermanentUpgrade.BuffScrollDuration] || 0)
            + (tier * 5)
            + this.$pets.getTotalPermanentUpgradeValue(interfaces_1.PermanentUpgrade.BuffScrollDuration)
            + this.$premium.getUpgradeLevel(interfaces_1.PermanentUpgrade.BuffScrollDuration));
        this.$statistics.set('Game/Premium/Upgrade/ChoiceLogSize', 10
            + (allBuffBoosts[interfaces_1.PermanentUpgrade.ChoiceLogSizeBoost] || 0)
            + (allAchievementBoosts[interfaces_1.PermanentUpgrade.ChoiceLogSizeBoost] || 0)
            + (tier * 10)
            + this.$pets.getTotalPermanentUpgradeValue(interfaces_1.PermanentUpgrade.ChoiceLogSizeBoost)
            + this.$premium.getUpgradeLevel(interfaces_1.PermanentUpgrade.ChoiceLogSizeBoost));
        this.$statistics.set('Game/Premium/Upgrade/ItemStatCap', 300
            + (allBuffBoosts[interfaces_1.PermanentUpgrade.ItemStatCapBoost] || 0)
            + (allAchievementBoosts[interfaces_1.PermanentUpgrade.ItemStatCapBoost] || 0)
            + (tier * 100)
            + this.$pets.getTotalPermanentUpgradeValue(interfaces_1.PermanentUpgrade.ItemStatCapBoost)
            + this.$premium.getUpgradeLevel(interfaces_1.PermanentUpgrade.ItemStatCapBoost) * 10);
        this.$statistics.set('Game/Premium/Upgrade/EnchantCap', 10
            + (allBuffBoosts[interfaces_1.PermanentUpgrade.EnchantCapBoost] || 0)
            + (allAchievementBoosts[interfaces_1.PermanentUpgrade.EnchantCapBoost] || 0)
            + (tier)
            + this.$pets.getTotalPermanentUpgradeValue(interfaces_1.PermanentUpgrade.EnchantCapBoost)
            + this.$premium.getUpgradeLevel(interfaces_1.PermanentUpgrade.EnchantCapBoost));
        this.$statistics.set('Game/Premium/Upgrade/PetMissions', 3
            + (allBuffBoosts[interfaces_1.PermanentUpgrade.PetMissionCapBoost] || 0)
            + (allAchievementBoosts[interfaces_1.PermanentUpgrade.PetMissionCapBoost] || 0)
            + (tier)
            + this.$pets.getTotalPermanentUpgradeValue(interfaces_1.PermanentUpgrade.PetMissionCapBoost)
            + this.$premium.getUpgradeLevel(interfaces_1.PermanentUpgrade.PetMissionCapBoost));
        this.$statistics.set('Game/Premium/Upgrade/MaxStaminaBoost', 0
            + (allBuffBoosts[interfaces_1.PermanentUpgrade.MaxStaminaBoost] || 0)
            + (allAchievementBoosts[interfaces_1.PermanentUpgrade.MaxStaminaBoost] || 0)
            + (tier * 3)
            + this.$pets.getTotalPermanentUpgradeValue(interfaces_1.PermanentUpgrade.MaxStaminaBoost)
            + this.$premium.getUpgradeLevel(interfaces_1.PermanentUpgrade.MaxStaminaBoost) * 5);
        this.$statistics.set('Game/Premium/Upgrade/InjuryThreshold', 3
            + (allBuffBoosts[interfaces_1.PermanentUpgrade.InjuryThreshold] || 0)
            + (allAchievementBoosts[interfaces_1.PermanentUpgrade.InjuryThreshold] || 0));
        this.$statistics.set('Game/Premium/Upgrade/MaxPetsInCombat', 1
            + (allBuffBoosts[interfaces_1.PermanentUpgrade.MaxPetsInCombat] || 0)
            + (allAchievementBoosts[interfaces_1.PermanentUpgrade.MaxPetsInCombat] || 0));
        this.$pets.validatePetMissionsAndQuantity(this);
        this.$choices.updateSize(this);
        this.$inventory.updateSize(this);
    };
    Player.prototype.gainILP = function (ilp) {
        this.increaseStatistic('Game/Premium/ILP/LifetimeGain', ilp);
        this.$premium.gainILP(ilp);
    };
    Player.prototype.changeProfessionWithRef = function (prof) {
        this.changeProfession(this.$game.professionHelper.getProfession(prof));
    };
    Player.prototype.changeProfession = function (prof) {
        this.profession = prof.constructor.name;
        this.$profession = prof;
        this.$professionData = prof.$professionData;
        this.recalculateStats();
        this.$$game.sendClientUpdateForPlayer(this);
    };
    Player.prototype.hasAchievement = function (achi) {
        return !!this.$achievements.getAchievementAchieved(achi);
    };
    Player.prototype.collectibleRarityILPValue = function (rarity) {
        switch (rarity) {
            case interfaces_1.ItemClass.Newbie: return 1;
            case interfaces_1.ItemClass.Basic: return 2;
            case interfaces_1.ItemClass.Pro: return 3;
            case interfaces_1.ItemClass.Idle: return 4;
            case interfaces_1.ItemClass.Godly: return 5;
            case interfaces_1.ItemClass.Goatly: return 7;
            case interfaces_1.ItemClass.Omega: return 10;
            default: return 1;
        }
    };
    Player.prototype.tryFindCollectible = function (_a) {
        var name = _a.name, rarity = _a.rarity, description = _a.description, storyline = _a.storyline;
        this.increaseStatistic('Item/Collectible/Touch', 1);
        var currentCollectible = this.$collectibles.get(name);
        // create a new collectible
        if (!currentCollectible) {
            currentCollectible = {
                name: name,
                map: this.map,
                region: this.region,
                rarity: rarity,
                description: description,
                storyline: storyline,
                count: 0,
                touched: 0,
                foundAt: 0
            };
            this.$collectibles.add(currentCollectible);
        }
        // if it doesn't have found-at, set it + count++ it
        if (!currentCollectible.foundAt) {
            currentCollectible.foundAt = Date.now();
            currentCollectible.count++;
            this.increaseStatistic('Item/Collectible/Find', 1);
            this.gainILP(this.collectibleRarityILPValue(currentCollectible.rarity));
            var messageData = {
                when: Date.now(),
                type: interfaces_1.AdventureLogEventType.Item,
                message: this.fullName() + " found \"" + currentCollectible.name + "\" in " + this.map + " - " + (this.region || 'Wilderness') + "!"
            };
            this.$game.subscriptionManager.emitToChannel(interfaces_1.Channel.PlayerAdventureLog, { playerNames: [this.name], data: messageData });
        }
        // always touch it
        currentCollectible.touched++;
        currentCollectible.rarity = rarity;
        currentCollectible.description = description;
        currentCollectible.storyline = storyline;
    };
    Player.prototype.hasCollectible = function (coll) {
        return this.$collectibles.has(coll);
    };
    Player.prototype.grantBuff = function (buff, canShare) {
        if (canShare === void 0) { canShare = false; }
        this.increaseStatistic("Character/" + (buff.booster ? 'Booster' : 'Injury') + "/Give", 1);
        if (this.$party && canShare) {
            this.increaseStatistic("Character/" + (buff.booster ? 'Booster' : 'Injury') + "/Give", this.$party.members.length - 1);
            this.$game.buffManager.shareBuff(this, buff);
        }
        this.addBuff(buff);
    };
    Player.prototype.addBuff = function (buff) {
        if (!buff.statistic)
            return;
        this.increaseStatistic("Character/" + (buff.booster ? 'Booster' : 'Injury') + "/Receive", 1);
        this.buffWatches[buff.statistic] = this.buffWatches[buff.statistic] || [];
        this.buffWatches[buff.statistic].unshift(buff);
        this.buffWatches[buff.statistic] = lodash_1.uniqBy(this.buffWatches[buff.statistic], function (checkBuff) { return checkBuff.name; });
        this.syncPremium();
        this.recalculateStats();
        this.$pets.$activePet.recalculateStats();
    };
    Player.prototype.setPos = function (x, y, map, region) {
        var oldMap = this.map;
        this.x = x;
        this.y = y;
        this.map = map;
        this.region = region;
        if (this.map !== oldMap)
            this.divineDirection = null;
    };
    Player.prototype.setDivineDirection = function (x, y) {
        if (this.divineDirection || x === 0 || y === 0) {
            this.divineDirection = null;
            return;
        }
        this.divineDirection = { x: x, y: y, steps: 360 };
    };
    Player.prototype.changeGender = function (gender) {
        this.gender = gender;
        this.$game.sendClientUpdateForPlayer(this);
    };
    Player.prototype.changeTitle = function (title) {
        this.title = title;
        this.$game.sendClientUpdateForPlayer(this);
    };
    Player.prototype.tryToDoNewCharacter = function () {
        var canDo = Object.values(this.$choices.$choicesData.choices).length === 0 && this.$statistics.get('Character/Choose/Total') === 0;
        if (!canDo)
            return;
        this.$game.doStartingPlayerStuff(this);
    };
    Player.prototype.getAllInjuries = function () {
        var allInjuries = [];
        Object.values(this.buffWatches).forEach(function (buffList) {
            allInjuries.push.apply(allInjuries, buffList.filter(function (x) { return !x.booster; }));
        });
        return allInjuries;
    };
    Player.prototype.injuryCount = function () {
        return this.getAllInjuries().length;
    };
    Player.prototype.giveCure = function () {
        this.$$game.buffManager.cureInjury(this);
        this.cureInjury();
    };
    Player.prototype.cureInjury = function () {
        var _this = this;
        var hasCured = false;
        Object.keys(this.buffWatches).forEach(function (buffKey) {
            if (hasCured)
                return;
            _this.buffWatches[buffKey] = _this.buffWatches[buffKey].filter(function (buff) {
                if (hasCured || buff.booster)
                    return true;
                hasCured = true;
                return false;
            });
        });
        if (hasCured) {
            this.increaseStatistic("Character/Injury/Cure", 1);
            this.recalculateStats();
        }
    };
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        typeorm_1.ObjectIdColumn(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "_id", void 0);
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        tslib_1.__metadata("design:type", Object)
    ], Player.prototype, "$game", void 0);
    tslib_1.__decorate([
        typeorm_1.Index({ unique: true }),
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "userId", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "currentUserId", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "authId", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "authSyncedTo", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "authType", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "modTier", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "mutedUntil", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "lastMessageSent", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "messageCooldown", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "discordTag", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "il3CharName", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "createdAt", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Boolean)
    ], Player.prototype, "loggedIn", void 0);
    tslib_1.__decorate([
        typeorm_1.Index({ unique: true }),
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "name", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "ascensionLevel", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "lastAscension", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", restricted_number_1.RestrictedNumber)
    ], Player.prototype, "level", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", restricted_number_1.RestrictedNumber)
    ], Player.prototype, "xp", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "profession", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "gender", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "title", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "map", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], Player.prototype, "region", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "x", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "y", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "gold", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "eventSteps", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", restricted_number_1.RestrictedNumber)
    ], Player.prototype, "stamina", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "nextStaminaTick", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "stepCooldown", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Player.prototype, "lastDir", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Player.prototype, "divineDirection", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Player.prototype, "buffWatches", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Player.prototype, "cooldowns", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Player.prototype, "lastLoc", void 0);
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        tslib_1.__metadata("design:type", Profession_1.BaseProfession)
    ], Player.prototype, "$profession", void 0);
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        tslib_1.__metadata("design:type", Statistics_entity_1.Statistics)
    ], Player.prototype, "$statistics", void 0);
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        tslib_1.__metadata("design:type", Inventory_entity_1.Inventory)
    ], Player.prototype, "$inventory", void 0);
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        tslib_1.__metadata("design:type", Choices_entity_1.Choices)
    ], Player.prototype, "$choices", void 0);
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        tslib_1.__metadata("design:type", Achievements_entity_1.Achievements)
    ], Player.prototype, "$achievements", void 0);
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        tslib_1.__metadata("design:type", Personalities_entity_1.Personalities)
    ], Player.prototype, "$personalities", void 0);
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        tslib_1.__metadata("design:type", Collectibles_entity_1.Collectibles)
    ], Player.prototype, "$collectibles", void 0);
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        tslib_1.__metadata("design:type", Pets_entity_1.Pets)
    ], Player.prototype, "$pets", void 0);
    tslib_1.__decorate([
        nonenumerable_1.nonenumerable,
        tslib_1.__metadata("design:type", Premium_entity_1.Premium)
    ], Player.prototype, "$premium", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Array)
    ], Player.prototype, "availableGenders", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Array)
    ], Player.prototype, "availableTitles", void 0);
    Player = tslib_1.__decorate([
        typeorm_1.Entity()
    ], Player);
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=Player.entity.js.map