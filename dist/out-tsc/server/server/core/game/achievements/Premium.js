"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Premium = /** @class */ (function (_super) {
    tslib_1.__extends(Premium, _super);
    function Premium() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Premium.descriptionForTier = function (tier) {
        var baseStr = "Gain a title.";
        return baseStr;
    };
    Premium.calculateTier = function (player) {
        var steps = player.$statistics.get('Game/Premium/Tier');
        if (steps >= interfaces_1.PremiumTier.Subscriber3)
            return 4;
        if (steps >= interfaces_1.PremiumTier.Subscriber2)
            return 3;
        if (steps >= interfaces_1.PremiumTier.Subscriber)
            return 2;
        if (steps >= interfaces_1.PremiumTier.Subscriber3)
            return 1;
        return 0;
    };
    Premium.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: 'Donator' }
        ];
        if (tier >= 2) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Patron' });
        }
        if (tier >= 3) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Patron Saint' });
        }
        if (tier >= 4) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Golden Patron' });
        }
        return baseRewards;
    };
    Premium.statWatches = ['Game/Premium/Tier'];
    Premium.type = interfaces_1.AchievementType.Special;
    return Premium;
}(interfaces_1.Achievement));
exports.Premium = Premium;
//# sourceMappingURL=Premium.js.map