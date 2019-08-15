"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Cheater = /** @class */ (function (_super) {
    tslib_1.__extends(Cheater, _super);
    function Cheater() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cheater.descriptionForTier = function (tier) {
        var baseStr = "Cheater! You get a title.";
        return baseStr;
    };
    Cheater.calculateTier = function (player) {
        return player.$collectibles.has('How Did You Even Get Out Here') ? 1 : 0;
    };
    Cheater.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: 'Literal Cheater' }
        ];
        return baseRewards;
    };
    Cheater.statWatches = ['Item/Collectible/Find'];
    Cheater.type = interfaces_1.AchievementType.Explore;
    return Cheater;
}(interfaces_1.Achievement));
exports.Cheater = Cheater;
//# sourceMappingURL=Cheater.js.map