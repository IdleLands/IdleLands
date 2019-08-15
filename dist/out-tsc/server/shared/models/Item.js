"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b, _c, _d, _e;
var lodash_1 = require("lodash");
var uuid = require("uuid/v4");
var interfaces_1 = require("../interfaces");
var woodValues = (_a = {},
    _a[interfaces_1.Stat.HP] = 100,
    _a[interfaces_1.Stat.STR] = 5,
    _a[interfaces_1.Stat.DEX] = 10,
    _a[interfaces_1.Stat.AGI] = 10,
    _a);
var clayValues = (_b = {},
    _b[interfaces_1.Stat.HP] = 100,
    _b[interfaces_1.Stat.INT] = 5,
    _b[interfaces_1.Stat.DEX] = 10,
    _b[interfaces_1.Stat.AGI] = 10,
    _b);
var stoneValues = (_c = {},
    _c[interfaces_1.Stat.HP] = 100,
    _c[interfaces_1.Stat.CON] = 5,
    _c[interfaces_1.Stat.DEX] = 10,
    _c[interfaces_1.Stat.AGI] = 10,
    _c);
var astraliumValues = (_d = {},
    _d[interfaces_1.Stat.LUK] = 5,
    _d[interfaces_1.Stat.XP] = 1,
    _d[interfaces_1.Stat.GOLD] = 10,
    _d);
var scoreValues = (_e = {},
    _e[interfaces_1.Stat.HP] = 1,
    _e[interfaces_1.Stat.STR] = 4,
    _e[interfaces_1.Stat.INT] = 3,
    _e[interfaces_1.Stat.DEX] = 1,
    _e[interfaces_1.Stat.AGI] = 1,
    _e[interfaces_1.Stat.CON] = 3,
    _e[interfaces_1.Stat.LUK] = 5,
    _e[interfaces_1.Stat.XP] = 10,
    _e[interfaces_1.Stat.GOLD] = 3,
    _e);
var Item = /** @class */ (function () {
    function Item() {
    }
    Item.calcScoreForHash = function (hash) {
        return Object.keys(scoreValues)
            .map(function (statKey) { return (hash[statKey] || 0) * scoreValues[statKey]; })
            .reduce(function (prev, cur) { return prev + cur; }, 0);
    };
    Item.prototype.init = function (opts) {
        lodash_1.extend(this, opts);
        if (!this.id)
            this.id = uuid();
        if (!this.foundAt)
            this.foundAt = Date.now();
        if (!this.stats)
            this.stats = {};
        if (!this.itemClass)
            this.itemClass = interfaces_1.ItemClass.Basic;
        if (!this.enchantLevel)
            this.enchantLevel = 0;
        this.recalculateScore();
    };
    Item.prototype.recalculateScore = function () {
        var score = this.calcScore();
        if (!this.baseScore)
            this.baseScore = score;
        this.score = score;
    };
    Item.prototype.fullName = function () {
        if (this.enchantLevel)
            return "+" + this.enchantLevel + " " + this.name;
        return this.name;
    };
    Item.prototype.calcScore = function () {
        return Item.calcScoreForHash(this.stats);
    };
    Item.prototype.resourceValue = function (player, hash) {
        var _this = this;
        return Object.keys(hash)
            .map(function (statKey) { return Math.floor((_this.stats[statKey] || 0) / hash[statKey]); })
            .reduce(function (prev, cur) { return prev + cur; }, 0);
    };
    Item.prototype.woodValue = function (player) {
        return this.resourceValue(player, woodValues);
    };
    Item.prototype.clayValue = function (player) {
        return this.resourceValue(player, clayValues);
    };
    Item.prototype.stoneValue = function (player) {
        return this.resourceValue(player, stoneValues);
    };
    Item.prototype.astraliumValue = function (player) {
        return this.resourceValue(player, astraliumValues);
    };
    Item.prototype.isCurrentlyEnchantable = function (player) {
        return this.enchantLevel < player.$statistics.get('Game/Premium/Upgrade/EnchantCap');
    };
    Item.prototype.isUnderBoostablePercent = function (player) {
        return (this.score / this.baseScore) < (player.$statistics.get('Game/Premium/Upgrade/ItemStatCap') / 100);
    };
    return Item;
}());
exports.Item = Item;
//# sourceMappingURL=Item.js.map