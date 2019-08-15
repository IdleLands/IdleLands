"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Drunk = /** @class */ (function (_super) {
    tslib_1.__extends(Drunk, _super);
    function Drunk() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Drunk.descriptionForTier = function (tier) {
        var baseStr = "Gain a title and +5 max stamina for drunk-stepping 100,000 times.";
        if (tier >= 2) {
            baseStr = baseStr + " Title: Lush Lemming.";
        }
        return baseStr;
    };
    Drunk.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Movement/Steps/Drunk');
        if (steps >= 1000000)
            return 2;
        if (steps >= 100000)
            return 1;
        return 0;
    };
    Drunk.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_a = {}, _a[interfaces_1.PermanentUpgrade.MaxStaminaBoost] = 5, _a) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'Drunk' }
        ];
        if (tier >= 2) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Lush Lemming' });
        }
        return baseRewards;
    };
    Drunk.statWatches = ['Character/Movement/Steps/Drunk'];
    Drunk.type = interfaces_1.AchievementType.Event;
    return Drunk;
}(interfaces_1.Achievement));
exports.Drunk = Drunk;
//# sourceMappingURL=Drunk.js.map