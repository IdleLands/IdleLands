"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var PlayerOwned_1 = require("./PlayerOwned");
var interfaces_1 = require("../../interfaces");
var Gachas = require("../../../shared/astralgate");
var Premium = /** @class */ (function (_super) {
    tslib_1.__extends(Premium, _super);
    function Premium() {
        var _this = _super.call(this) || this;
        if (!_this.ilp)
            _this.ilp = 0;
        if (!_this.premiumTier)
            _this.premiumTier = interfaces_1.PremiumTier.None;
        if (!_this.upgradeLevels)
            _this.upgradeLevels = {};
        if (!_this.gachaFreeRolls)
            _this.gachaFreeRolls = {};
        return _this;
    }
    Object.defineProperty(Premium.prototype, "$premiumData", {
        get: function () {
            return { ilp: this.ilp, tier: this.premiumTier, upgradeLevels: this.upgradeLevels, gachaFreeRolls: this.gachaFreeRolls };
        },
        enumerable: true,
        configurable: true
    });
    Premium.prototype.hasILP = function (ilp) {
        return this.ilp >= ilp;
    };
    Premium.prototype.gainILP = function (ilp) {
        this.ilp += ilp;
    };
    Premium.prototype.spendILP = function (ilp) {
        this.ilp -= ilp;
        this.ilp = Math.max(this.ilp, 0);
    };
    Premium.prototype.buyUpgrade = function (upgrade) {
        if (!interfaces_1.PremiumScale[upgrade])
            return false;
        var curLevel = this.getUpgradeLevel(upgrade);
        var cost = Math.pow(interfaces_1.PremiumScale[upgrade], curLevel + 1);
        if (!this.hasILP(cost))
            return false;
        this.upgradeLevels[upgrade] = this.upgradeLevels[upgrade] || 0;
        this.upgradeLevels[upgrade]++;
        this.spendILP(cost);
        return true;
    };
    Premium.prototype.buyFestival = function (player, festival, duration) {
        duration = Math.floor(duration);
        var durationDays = Math.floor(duration / 24);
        if (!interfaces_1.FestivalCost[festival])
            return false;
        if (durationDays <= 0)
            return false;
        var cost = durationDays * interfaces_1.FestivalCost[festival];
        if (!this.hasILP(cost))
            return false;
        var alreadyHasFestival = player.$$game.festivalManager.hasFestivalForName(player.name);
        if (alreadyHasFestival)
            return false;
        var festRef = {
            name: player.name + "'s Festival",
            endTime: Date.now() + (1000 * 60 * 60 * 24 * durationDays),
            startedBy: player.name,
            stats: interfaces_1.FestivalStats[festival]
        };
        player.$$game.festivalManager.startFestival(player, festRef);
        this.spendILP(cost);
        return true;
    };
    Premium.prototype.buyOther = function (player, other) {
        var cost = interfaces_1.OtherILPCosts[other];
        if (!cost)
            return false;
        if (!this.hasILP(cost))
            return false;
        this.spendILP(cost);
        switch (other) {
            case interfaces_1.OtherILPPurchase.ResetCooldowns: {
                player.cooldowns = {};
                break;
            }
        }
        return true;
    };
    Premium.prototype.getUpgradeLevel = function (upgrade) {
        return this.upgradeLevels[upgrade] || 0;
    };
    Premium.prototype.getNextFreeRoll = function (gachaName) {
        return this.gachaFreeRolls[gachaName] || 0;
    };
    Premium.prototype.validateAndEarnGachaRewards = function (player, rewards) {
        rewards = this.validateRewards(player, rewards);
        this.earnGachaRewards(player, rewards);
        return rewards;
    };
    Premium.prototype.doGachaRoll = function (player, gachaName, numRolls) {
        if (numRolls === void 0) { numRolls = 1; }
        if (!Gachas[gachaName])
            return false;
        var gacha = new Gachas[gachaName]();
        if (!gacha.canRoll(player, numRolls))
            return false;
        if (gacha.canRollFree(player)) {
            this.gachaFreeRolls[gacha.name] = gacha.getNextGachaFreeInterval();
            player.increaseStatistic('Astral Gate/Roll/Free', 1);
        }
        else {
            gacha.spendCurrency(player, numRolls);
            player.increaseStatistic('Astral Gate/Roll/Currency', 1);
        }
        player.increaseStatistic("Astral Gate/Gates/" + gacha.name, 1);
        var rewards = [];
        for (var i = 0; i < numRolls; i++) {
            rewards.push(gacha.roll());
        }
        rewards = this.validateAndEarnGachaRewards(player, rewards);
        return rewards;
    };
    Premium.prototype.validateRewards = function (player, rewards) {
        var _a = player.$$game.assetManager.allBossAssets, creatures = _a.creatures, items = _a.items;
        var randomBoss = player.$$game.rngService.pickone(Object.keys(creatures));
        var boss = player.level.total >= creatures[randomBoss].attributes.level ? creatures[randomBoss] : null;
        return rewards.map(function (reward) {
            // we can't get the same collectible twice if we have it
            if (reward.includes('collectible')) {
                var _a = reward.split(':'), x = _a[0], sub = _a[1], color = _a[2];
                if (sub === 'Soul' && player.$collectibles.hasCurrently("Pet Soul: " + color))
                    return "item:Crystal:" + color;
                if (sub === 'guardian') {
                    if (!boss || !boss.collectibles || !boss.collectibles.length)
                        return "xp:player:sm";
                    return "collectible:guardian:" + randomBoss;
                }
                if (sub === 'historical') {
                    var collectibles = player.$collectibles.getUnfoundOwnedCollectibles();
                    if (collectibles.length === 0)
                        return 'xp:player:max';
                    var chosenName = player.$$game.rngService.pickone(collectibles).name;
                    return "collectible:historical:" + chosenName;
                }
            }
            if (reward === interfaces_1.GachaReward.GuardianItem) {
                if (!boss || !boss.items || !boss.items.length)
                    return "xp:player:sm";
                return "item:guardian:" + boss.items[0].name;
            }
            if (reward === interfaces_1.GachaReward.ItemTeleportScrollRandom) {
                var towns_1 = ['Norkos Town', 'Maeles Town', 'Vocalnus Town', 'Frigri Town'];
                var otherTowns = ['Raburro Town', 'Homlet Town', 'Astral Town'];
                otherTowns.forEach(function (town) {
                    if (!player.$statistics.get("Map/" + town))
                        return;
                    towns_1.push(town);
                });
                var chosenLocation = player.$$game.rngService.pickone(towns_1);
                return "item:teleportscroll:" + chosenLocation;
            }
            if (reward === interfaces_1.GachaReward.ItemTeleportScrollACR) {
                return "item:teleportscroll:Astral Control Room";
            }
            return reward;
        });
    };
    Premium.prototype.earnGachaRewards = function (player, rewards) {
        var _a = player.$$game.assetManager.allBossAssets, creatures = _a.creatures, items = _a.items;
        rewards.forEach(function (reward) {
            var _a = reward.split(':'), main = _a[0], sub = _a[1], choice = _a[2];
            switch (main) {
                case 'xp': {
                    var xpGained = {
                        sm: function (char) { return Math.floor(char.xp.maximum * 0.01); },
                        md: function (char) { return Math.floor(char.xp.maximum * 0.05); },
                        lg: function (char) { return Math.floor(char.xp.maximum * 0.10); },
                        max: function (char) { return Math.floor(char.xp.maximum); }
                    };
                    if (sub === 'player') {
                        player.gainXP(xpGained[choice](player));
                    }
                    if (sub === 'pet') {
                        player.$pets.$activePet.gainXP(xpGained[choice](player.$pets.$activePet));
                    }
                    break;
                }
                case 'gold': {
                    var goldEarned = { sm: 1000, md: 10000, lg: 100000 };
                    player.gainGold(goldEarned[choice]);
                    break;
                }
                case 'collectible': {
                    if (sub === 'Soul') {
                        player.tryFindCollectible({
                            name: "Pet Soul: " + choice,
                            rarity: interfaces_1.ItemClass.Goatly,
                            description: "A floating ball of... pet essence? Perhaps you can tame this " + choice + " soul.",
                            storyline: "Lore: Astral Gate"
                        });
                    }
                    if (sub === 'guardian') {
                        var collectible = creatures[choice].collectibles[0];
                        player.tryFindCollectible({
                            name: collectible.name,
                            rarity: interfaces_1.ItemClass.Guardian,
                            description: collectible.flavorText,
                            storyline: collectible.storyline
                        });
                    }
                    if (sub === 'historical') {
                        player.$collectibles.refindCollectible(choice);
                    }
                    break;
                }
                case 'event': {
                    player.$$game.eventManager.doEventForPlayer(player, choice);
                    break;
                }
                case 'item': {
                    if (sub === 'Crystal') {
                        player.$pets.addAscensionMaterial("Crystal" + choice);
                    }
                    if (sub === 'teleportscroll') {
                        player.$inventory.addTeleportScroll(choice);
                    }
                    if (sub === 'generated') {
                        var generatedItem = player.$$game.itemGenerator.generateItem({ forceClass: choice });
                        player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.FindItem, { fromPet: true, item: generatedItem });
                    }
                    if (sub === 'guardian') {
                        var item = items[choice];
                        var generatedItem = player.$$game.itemGenerator.generateGuardianItem(player, choice, item.type, item);
                        player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.FindItem, { fromGuardian: true, item: generatedItem });
                    }
                    if (sub === 'buffscroll') {
                        var stats_1 = {};
                        var chooseAndAddStat = function () {
                            var stat = player.$$game.rngService.pickone(interfaces_1.AllStatsButSpecial);
                            var val = Math.floor(player.getStat(interfaces_1.StatPartners[stat]) / 10);
                            stats_1[stat] = stats_1[stat] || 0;
                            stats_1[stat] += val;
                        };
                        chooseAndAddStat();
                        if (player.$$game.rngService.likelihood(50))
                            chooseAndAddStat();
                        if (player.$$game.rngService.likelihood(25))
                            chooseAndAddStat();
                        var scroll_1 = {
                            id: player.$$game.rngService.id(),
                            name: player.$$game.assetManager.scroll(),
                            stats: stats_1,
                            expiresAt: Date.now() + (259200 * 1000) // 3 days in seconds * 1000
                        };
                        player.$inventory.addBuffScroll(scroll_1);
                    }
                    break;
                }
            }
        });
    };
    Premium.prototype.setTier = function (tier) {
        this.premiumTier = tier;
    };
    tslib_1.__decorate([
        typeorm_1.ObjectIdColumn(),
        tslib_1.__metadata("design:type", String)
    ], Premium.prototype, "_id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Premium.prototype, "ilp", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Premium.prototype, "premiumTier", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Premium.prototype, "upgradeLevels", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Premium.prototype, "gachaFreeRolls", void 0);
    Premium = tslib_1.__decorate([
        typeorm_1.Entity(),
        tslib_1.__metadata("design:paramtypes", [])
    ], Premium);
    return Premium;
}(PlayerOwned_1.PlayerOwned));
exports.Premium = Premium;
//# sourceMappingURL=Premium.entity.js.map