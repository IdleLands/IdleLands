"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Yearling = /** @class */ (function (_super) {
    tslib_1.__extends(Yearling, _super);
    function Yearling() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Yearling.descriptionForTier = function (tier) {
        var baseStr = "You logged on at least a year ago for the first time! Gain +" + 10 * tier + "% to all stats.";
        if (tier >= 1) {
            baseStr = baseStr + " Title: Single Yearling. Genders: veteran male, veteran female.";
        }
        if (tier >= 2) {
            baseStr = baseStr + " Title: Double Yearling. Genders: angry bear, mighty glowcloud.";
        }
        return baseStr;
    };
    Yearling.calculateTier = function (player) {
        var startDate = new Date(player.createdAt);
        var now = new Date();
        return now.getFullYear() - startDate.getFullYear();
    };
    Yearling.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.STR] = 1 + (tier * 0.1),
                    _a[interfaces_1.Stat.DEX] = 1 + (tier * 0.1),
                    _a[interfaces_1.Stat.CON] = 1 + (tier * 0.1),
                    _a[interfaces_1.Stat.AGI] = 1 + (tier * 0.1),
                    _a[interfaces_1.Stat.INT] = 1 + (tier * 0.1),
                    _a[interfaces_1.Stat.LUK] = 1 + (tier * 0.1),
                    _a[interfaces_1.Stat.XP] = 1 + (tier * 0.1),
                    _a[interfaces_1.Stat.GOLD] = 1 + (tier * 0.1),
                    _a) }
        ];
        if (tier >= 1) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Single Yearling' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Gender, gender: 'veteran male' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Gender, gender: 'veteran female' });
        }
        if (tier >= 2) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Double Yearling' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Gender, gender: 'angry bear' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Gender, gender: 'mighty glowcloud' });
        }
        return baseRewards;
    };
    Yearling.statWatches = ['Game/Logins'];
    Yearling.type = interfaces_1.AchievementType.Special;
    return Yearling;
}(interfaces_1.Achievement));
exports.Yearling = Yearling;
//# sourceMappingURL=Yearling.js.map