"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var AncientAscender = /** @class */ (function (_super) {
    tslib_1.__extends(AncientAscender, _super);
    function AncientAscender() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AncientAscender.descriptionForTier = function (tier) {
        var baseStr = "Gain a title and +" + tier + "% to all base stats for ascending " + tier + " times in IdleLands 3! \uD83C\uDF7B";
        return baseStr;
    };
    AncientAscender.calculateTier = function (player) {
        return player.$statistics.get('Game/IdleLands3/Ascensions');
    };
    AncientAscender.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.STR] = 1 + (tier * 0.01),
                    _a[interfaces_1.Stat.INT] = 1 + (tier * 0.01),
                    _a[interfaces_1.Stat.AGI] = 1 + (tier * 0.01),
                    _a[interfaces_1.Stat.DEX] = 1 + (tier * 0.01),
                    _a[interfaces_1.Stat.CON] = 1 + (tier * 0.01),
                    _a[interfaces_1.Stat.LUK] = 1 + (tier * 0.01),
                    _a) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'Traveler of the Stars ⭐' }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Glowing Star 🌟' });
        }
        if (tier >= 10) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'One with the Stars ✨' });
        }
        if (tier >= 15) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Shooting Star ☄️' });
        }
        if (tier >= 18) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Drunk Star 🍻' });
        }
        if (tier >= 20) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Staggering Star 💫' });
        }
        if (tier >= 25) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Seli Taiken 💥' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Zigniber 💥' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Therealtahu 💥' });
        }
        if (tier >= 30) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Glopii 🍀' });
        }
        return baseRewards;
    };
    AncientAscender.statWatches = ['Game/IdleLands3/Ascensions'];
    AncientAscender.type = interfaces_1.AchievementType.Special;
    return AncientAscender;
}(interfaces_1.Achievement));
exports.AncientAscender = AncientAscender;
//# sourceMappingURL=AncientAscender.js.map