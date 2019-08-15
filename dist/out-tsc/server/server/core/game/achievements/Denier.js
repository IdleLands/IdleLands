"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Denier = /** @class */ (function (_super) {
    tslib_1.__extends(Denier, _super);
    function Denier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Denier.descriptionForTier = function (tier) {
        var baseStr = "Gain a title, +1 Choice Log Size and and +2 base XP for choosing No many times.";
        return baseStr;
    };
    Denier.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Choose/Personality/Denier');
        return steps >= Denier.base ? 1 : 0;
    };
    Denier.rewardsForTier = function (tier) {
        var _a, _b;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_a = {}, _a[interfaces_1.PermanentUpgrade.ChoiceLogSizeBoost] = 1, _a) },
            { type: interfaces_1.AchievementRewardType.Stats, stats: (_b = {}, _b[interfaces_1.Stat.XP] = 2, _b) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'No-Way-Dude' }
        ];
        return baseRewards;
    };
    Denier.base = 5000;
    Denier.statWatches = ['Character/Choose/Personality/Denier'];
    Denier.type = interfaces_1.AchievementType.Event;
    return Denier;
}(interfaces_1.Achievement));
exports.Denier = Denier;
//# sourceMappingURL=Denier.js.map