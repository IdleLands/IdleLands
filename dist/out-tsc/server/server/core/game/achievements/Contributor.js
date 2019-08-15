"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Contributor = /** @class */ (function (_super) {
    tslib_1.__extends(Contributor, _super);
    function Contributor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Contributor.descriptionForTier = function (tier) {
        var baseStr = "Gain a title.";
        return baseStr;
    };
    Contributor.calculateTier = function (player) {
        var steps = player.$statistics.get('Game/Contributor/ContributorTier');
        return steps >= Contributor.base ? 1 : 0;
    };
    Contributor.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: 'Contributor' }
        ];
        return baseRewards;
    };
    Contributor.base = 1;
    Contributor.statWatches = ['Game/Contributor/ContributorTier'];
    Contributor.type = interfaces_1.AchievementType.Special;
    return Contributor;
}(interfaces_1.Achievement));
exports.Contributor = Contributor;
//# sourceMappingURL=Contributor.js.map