"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Affirmer = /** @class */ (function (_super) {
    tslib_1.__extends(Affirmer, _super);
    function Affirmer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Affirmer.descriptionForTier = function (tier) {
        var baseStr = "Gain a title, +1 Choice Log Size and +2 base XP for choosing Yes many times.";
        return baseStr;
    };
    Affirmer.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Choose/Personality/Affirmer');
        return steps >= Affirmer.base ? 1 : 0;
    };
    Affirmer.rewardsForTier = function (tier) {
        var _a, _b;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_a = {}, _a[interfaces_1.PermanentUpgrade.ChoiceLogSizeBoost] = 1, _a) },
            { type: interfaces_1.AchievementRewardType.Stats, stats: (_b = {}, _b[interfaces_1.Stat.XP] = 2, _b) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'Yes-Person' }
        ];
        return baseRewards;
    };
    Affirmer.base = 5000;
    Affirmer.statWatches = ['Character/Choose/Personality/Affirmer'];
    Affirmer.type = interfaces_1.AchievementType.Event;
    return Affirmer;
}(interfaces_1.Achievement));
exports.Affirmer = Affirmer;
//# sourceMappingURL=Affirmer.js.map