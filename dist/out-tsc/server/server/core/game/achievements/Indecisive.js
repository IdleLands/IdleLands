"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Indecisive = /** @class */ (function (_super) {
    tslib_1.__extends(Indecisive, _super);
    function Indecisive() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Indecisive.descriptionForTier = function (tier) {
        var baseStr = "Gain a title, +2 Choice Log Size and and +2 base XP for just not caring many times.";
        return baseStr;
    };
    Indecisive.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Choose/Personality/Indecisive');
        return steps >= Indecisive.base ? 1 : 0;
    };
    Indecisive.rewardsForTier = function (tier) {
        var _a, _b;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_a = {}, _a[interfaces_1.PermanentUpgrade.ChoiceLogSizeBoost] = 2, _a) },
            { type: interfaces_1.AchievementRewardType.Stats, stats: (_b = {}, _b[interfaces_1.Stat.XP] = 2, _b) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'Whatever-Dude' }
        ];
        return baseRewards;
    };
    Indecisive.base = 5000;
    Indecisive.statWatches = ['Character/Choose/Personality/Indecisive'];
    Indecisive.type = interfaces_1.AchievementType.Event;
    return Indecisive;
}(interfaces_1.Achievement));
exports.Indecisive = Indecisive;
//# sourceMappingURL=Indecisive.js.map