"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var AncientSpiritualist = /** @class */ (function (_super) {
    tslib_1.__extends(AncientSpiritualist, _super);
    function AncientSpiritualist() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AncientSpiritualist.descriptionForTier = function (tier) {
        var baseStr = "Gain a title and +10% to all special stats for achieving a needlessly tough challenge! \uD83C\uDF7B";
        return baseStr;
    };
    AncientSpiritualist.calculateTier = function (player) {
        return player.$statistics.get('Game/IdleLands3/Spiritualist') ? 1 : 0;
    };
    AncientSpiritualist.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.XP] = 1 + (tier * 0.1),
                    _a[interfaces_1.Stat.HP] = 1 + (tier * 0.1),
                    _a[interfaces_1.Stat.GOLD] = 1 + (tier * 0.1),
                    _a) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'Spirit Tamer 👻' }
        ];
        return baseRewards;
    };
    AncientSpiritualist.statWatches = ['Game/IdleLands3/Spiritualist'];
    AncientSpiritualist.type = interfaces_1.AchievementType.Special;
    return AncientSpiritualist;
}(interfaces_1.Achievement));
exports.AncientSpiritualist = AncientSpiritualist;
//# sourceMappingURL=AncientSpiritualist.js.map