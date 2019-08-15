"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("../interfaces");
var lootastic_1 = require("lootastic");
var BaseGachaRoller = /** @class */ (function () {
    function BaseGachaRoller() {
        this.name = '???';
        this.desc = '???';
        this.rewards = [];
        this.rollCost = 999;
    }
    BaseGachaRoller.prototype.canRollFree = function (player) {
        if (!this.freeResetInterval)
            return false;
        if (this.freeResetInterval === interfaces_1.GachaFreeReset.Daily)
            return player.$premium.getNextFreeRoll(this.name) < Date.now();
        return false;
    };
    BaseGachaRoller.prototype.canRoll = function (player, numRolls) {
        if (numRolls === void 0) { numRolls = 1; }
        var canRollFree = this.canRollFree(player);
        if (canRollFree)
            return true;
        return player.$premium.hasILP(this.rollCost * numRolls);
    };
    BaseGachaRoller.prototype.getNextGachaFreeInterval = function () {
        if (this.freeResetInterval === interfaces_1.GachaFreeReset.Daily) {
            var d = new Date();
            d.setHours(24, 0, 0, 0);
            return d.getTime();
        }
        return 0;
    };
    BaseGachaRoller.prototype.spendCurrency = function (player, numRolls) {
        if (!this.requiredToken) {
            player.$premium.spendILP(numRolls * this.rollCost);
        }
    };
    BaseGachaRoller.prototype.roll = function () {
        var table = new lootastic_1.LootTable(this.rewards);
        return table.chooseWithReplacement(1)[0];
    };
    BaseGachaRoller.prototype.roll10 = function () {
        var table = new lootastic_1.LootTable(this.rewards);
        return table.chooseWithReplacement(10);
    };
    return BaseGachaRoller;
}());
exports.BaseGachaRoller = BaseGachaRoller;
//# sourceMappingURL=BaseGachaRoller.js.map