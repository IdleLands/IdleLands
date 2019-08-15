"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var AncientWolf = /** @class */ (function (_super) {
    tslib_1.__extends(AncientWolf, _super);
    function AncientWolf() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AncientWolf.descriptionForTier = function (tier) {
        var baseStr = "Gain a title and +10% to all special stats for achieving a very needlessly tough challenge! \uD83C\uDF7B";
        return baseStr;
    };
    AncientWolf.calculateTier = function (player) {
        return player.$statistics.get('Game/IdleLands3/Wolfmaster') ? 1 : 0;
    };
    AncientWolf.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.XP] = 1 + (tier * 0.1),
                    _a[interfaces_1.Stat.HP] = 1 + (tier * 0.1),
                    _a[interfaces_1.Stat.GOLD] = 1 + (tier * 0.1),
                    _a) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'Wolf Tamer 🐺' }
        ];
        return baseRewards;
    };
    AncientWolf.statWatches = ['Game/IdleLands3/Wolfmaster'];
    AncientWolf.type = interfaces_1.AchievementType.Special;
    return AncientWolf;
}(interfaces_1.Achievement));
exports.AncientWolf = AncientWolf;
//# sourceMappingURL=AncientWolf.js.map