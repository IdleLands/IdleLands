"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Forsaken = /** @class */ (function (_super) {
    tslib_1.__extends(Forsaken, _super);
    function Forsaken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Forsaken.descriptionForTier = function (tier) {
        var baseStr = "Gain a title for being forsaken 5,000 times. You already have the pet attribute.";
        return baseStr;
    };
    Forsaken.calculateTier = function (player) {
        var steps = player.$statistics.get('Event/ForsakeGold/Times')
            + player.$statistics.get('Event/ForsakeXP/Times')
            + player.$statistics.get('Event/ForsakeItem/Times');
        return steps >= 5000 ? 1 : 0;
    };
    Forsaken.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: '#superdupercursed' }
        ];
        return baseRewards;
    };
    Forsaken.statWatches = ['Event/ForsakeGold/Times', 'Event/ForsakeXP/Times', 'Event/ForsakeItem/Times'];
    Forsaken.type = interfaces_1.AchievementType.Event;
    return Forsaken;
}(interfaces_1.Achievement));
exports.Forsaken = Forsaken;
//# sourceMappingURL=Forsaken.js.map