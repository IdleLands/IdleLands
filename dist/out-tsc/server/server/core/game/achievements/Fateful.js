"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Fateful = /** @class */ (function (_super) {
    tslib_1.__extends(Fateful, _super);
    function Fateful() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Fateful.descriptionForTier = function (tier) {
        var baseStr = "Gain a title and pet attribute (Fateful) for using the Fate Pools 500 times.";
        if (tier >= 2) {
            baseStr = baseStr + " You're also insane. You did it 100,000 times.";
        }
        return baseStr;
    };
    Fateful.calculateTier = function (player) {
        var steps = player.$statistics.get('Event/Providence/Times');
        if (steps >= 100000)
            return 2;
        if (steps >= 500)
            return 1;
        return 0;
    };
    Fateful.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: 'Fateful' },
            { type: interfaces_1.AchievementRewardType.PetAttribute, petattr: interfaces_1.PetAttribute.Fateful }
        ];
        if (tier >= 2) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Tempter of Fate' });
        }
        return baseRewards;
    };
    Fateful.statWatches = ['Event/Providence/Times'];
    Fateful.type = interfaces_1.AchievementType.Event;
    return Fateful;
}(interfaces_1.Achievement));
exports.Fateful = Fateful;
//# sourceMappingURL=Fateful.js.map