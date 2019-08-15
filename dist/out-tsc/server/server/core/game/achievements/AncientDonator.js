"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var AncientDonator = /** @class */ (function (_super) {
    tslib_1.__extends(AncientDonator, _super);
    function AncientDonator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AncientDonator.descriptionForTier = function (tier) {
        var baseStr = "Gain a title and +5% to all base stats for believing in this project and supporting it financially! \uD83C\uDF7B";
        return baseStr;
    };
    AncientDonator.calculateTier = function (player) {
        return player.$statistics.get('Game/IdleLands3/Donator') ? 1 : 0;
    };
    AncientDonator.rewardsForTier = function (tier) {
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
            { type: interfaces_1.AchievementRewardType.Title, title: 'Angel Investor 💸' }
        ];
        return baseRewards;
    };
    AncientDonator.statWatches = ['Game/IdleLands3/Donator'];
    AncientDonator.type = interfaces_1.AchievementType.Special;
    return AncientDonator;
}(interfaces_1.Achievement));
exports.AncientDonator = AncientDonator;
//# sourceMappingURL=AncientDonator.js.map