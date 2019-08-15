"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Ancient = /** @class */ (function (_super) {
    tslib_1.__extends(Ancient, _super);
    function Ancient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ancient.descriptionForTier = function (tier) {
        var baseStr = "Gain a title, +5 XP, +20 GOLD, and +5% to all stats for taking a chance on this game,\n    even after all of its major problems. Hopefully this launch goes more smoothly! \uD83C\uDF7B";
        return baseStr;
    };
    Ancient.calculateTier = function (player) {
        return player.$statistics.get('Game/IdleLands3/Played') ? 1 : 0;
    };
    Ancient.rewardsForTier = function (tier) {
        var _a, _b;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Stats, stats: (_a = {},
                    _a[interfaces_1.Stat.GOLD] = 20,
                    _a[interfaces_1.Stat.XP] = 5,
                    _a) },
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_b = {},
                    _b[interfaces_1.Stat.STR] = 1 + (tier * 0.05),
                    _b[interfaces_1.Stat.INT] = 1 + (tier * 0.05),
                    _b[interfaces_1.Stat.AGI] = 1 + (tier * 0.05),
                    _b[interfaces_1.Stat.DEX] = 1 + (tier * 0.05),
                    _b[interfaces_1.Stat.CON] = 1 + (tier * 0.05),
                    _b[interfaces_1.Stat.LUK] = 1 + (tier * 0.05),
                    _b[interfaces_1.Stat.HP] = 1 + (tier * 0.05),
                    _b[interfaces_1.Stat.GOLD] = 1 + (tier * 0.05),
                    _b[interfaces_1.Stat.XP] = 1 + (tier * 0.05),
                    _b) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'Ancient ⚜️' }
        ];
        return baseRewards;
    };
    Ancient.statWatches = ['Game/IdleLands3/Played'];
    Ancient.type = interfaces_1.AchievementType.Special;
    return Ancient;
}(interfaces_1.Achievement));
exports.Ancient = Ancient;
//# sourceMappingURL=Ancient.js.map