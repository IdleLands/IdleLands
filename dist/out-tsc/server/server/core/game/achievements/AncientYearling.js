"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var AncientYearling = /** @class */ (function (_super) {
    tslib_1.__extends(AncientYearling, _super);
    function AncientYearling() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AncientYearling.descriptionForTier = function (tier) {
        var baseStr = "Gain a title and +" + tier * 10 + "% to all special stats for staying logged in for over a year! \uD83C\uDF7B";
        return baseStr;
    };
    AncientYearling.calculateTier = function (player) {
        return player.$statistics.get('Game/IdleLands3/Anniversary');
    };
    AncientYearling.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.XP] = 1 + (tier * 0.1),
                    _a[interfaces_1.Stat.HP] = 1 + (tier * 0.1),
                    _a[interfaces_1.Stat.GOLD] = 1 + (tier * 0.1),
                    _a) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'World Traveler 🌎' }
        ];
        if (tier >= 2) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Seer of Moons 🌑' });
        }
        return baseRewards;
    };
    AncientYearling.statWatches = ['Game/IdleLands3/Anniversary'];
    AncientYearling.type = interfaces_1.AchievementType.Special;
    return AncientYearling;
}(interfaces_1.Achievement));
exports.AncientYearling = AncientYearling;
//# sourceMappingURL=AncientYearling.js.map