"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var AncientOmega = /** @class */ (function (_super) {
    tslib_1.__extends(AncientOmega, _super);
    function AncientOmega() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AncientOmega.descriptionForTier = function (tier) {
        var baseStr = "Gain a title, +15 XP, +100 GOLD, and +10% to all stats for supporting this crazy ride for 6 years.\n    You're amazing. And here's hoping the game never needs another rewrite! \uD83C\uDF7B";
        return baseStr;
    };
    AncientOmega.calculateTier = function (player) {
        return player.$statistics.get('Game/IdleLands2/Played') ? 1 : 0;
    };
    AncientOmega.rewardsForTier = function (tier) {
        var _a, _b;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Stats, stats: (_a = {},
                    _a[interfaces_1.Stat.GOLD] = 100,
                    _a[interfaces_1.Stat.XP] = 15,
                    _a) },
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_b = {},
                    _b[interfaces_1.Stat.STR] = 1 + (tier * 0.1),
                    _b[interfaces_1.Stat.INT] = 1 + (tier * 0.1),
                    _b[interfaces_1.Stat.AGI] = 1 + (tier * 0.1),
                    _b[interfaces_1.Stat.DEX] = 1 + (tier * 0.1),
                    _b[interfaces_1.Stat.CON] = 1 + (tier * 0.1),
                    _b[interfaces_1.Stat.LUK] = 1 + (tier * 0.1),
                    _b[interfaces_1.Stat.HP] = 1 + (tier * 0.1),
                    _b[interfaces_1.Stat.GOLD] = 1 + (tier * 0.1),
                    _b[interfaces_1.Stat.XP] = 1 + (tier * 0.1),
                    _b) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'Alpha & Omega ♊' }
        ];
        return baseRewards;
    };
    AncientOmega.statWatches = ['Game/IdleLands2/Played'];
    AncientOmega.type = interfaces_1.AchievementType.Special;
    return AncientOmega;
}(interfaces_1.Achievement));
exports.AncientOmega = AncientOmega;
//# sourceMappingURL=AncientOmega.js.map