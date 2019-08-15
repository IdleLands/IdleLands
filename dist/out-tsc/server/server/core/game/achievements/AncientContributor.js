"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var AncientContributor = /** @class */ (function (_super) {
    tslib_1.__extends(AncientContributor, _super);
    function AncientContributor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AncientContributor.descriptionForTier = function (tier) {
        var baseStr = "Gain a title and +5% to all base stats for believing in this project and making it better for the community! \uD83C\uDF7B";
        return baseStr;
    };
    AncientContributor.calculateTier = function (player) {
        return player.$statistics.get('Game/IdleLands3/Contributor') ? 1 : 0;
    };
    AncientContributor.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.STR] = 1 + (tier * 0.05),
                    _a[interfaces_1.Stat.INT] = 1 + (tier * 0.05),
                    _a[interfaces_1.Stat.AGI] = 1 + (tier * 0.05),
                    _a[interfaces_1.Stat.DEX] = 1 + (tier * 0.05),
                    _a[interfaces_1.Stat.CON] = 1 + (tier * 0.05),
                    _a[interfaces_1.Stat.LUK] = 1 + (tier * 0.05),
                    _a) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'Historian 🔍' }
        ];
        return baseRewards;
    };
    AncientContributor.statWatches = ['Game/IdleLands3/Contributor'];
    AncientContributor.type = interfaces_1.AchievementType.Special;
    return AncientContributor;
}(interfaces_1.Achievement));
exports.AncientContributor = AncientContributor;
//# sourceMappingURL=AncientContributor.js.map