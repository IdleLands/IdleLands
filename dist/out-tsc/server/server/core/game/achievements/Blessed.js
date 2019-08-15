"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Blessed = /** @class */ (function (_super) {
    tslib_1.__extends(Blessed, _super);
    function Blessed() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Blessed.descriptionForTier = function (tier) {
        var baseStr = "Gain a title and pet attribute (Blessed) for being blessed 5,000 times.";
        return baseStr;
    };
    Blessed.calculateTier = function (player) {
        var steps = player.$statistics.get('Event/BlessGold/Times')
            + player.$statistics.get('Event/BlessXP/Times')
            + player.$statistics.get('Event/BlessItem/Times');
        return steps >= 5000 ? 1 : 0;
    };
    Blessed.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: '#blessed' },
            { type: interfaces_1.AchievementRewardType.PetAttribute, petattr: interfaces_1.PetAttribute.Blessed }
        ];
        return baseRewards;
    };
    Blessed.statWatches = ['Event/BlessGold/Times', 'Event/BlessXP/Times', 'Event/BlessItem/Times'];
    Blessed.type = interfaces_1.AchievementType.Event;
    return Blessed;
}(interfaces_1.Achievement));
exports.Blessed = Blessed;
//# sourceMappingURL=Blessed.js.map