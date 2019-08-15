"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Jailbird = /** @class */ (function (_super) {
    tslib_1.__extends(Jailbird, _super);
    function Jailbird() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Jailbird.descriptionForTier = function (tier) {
        var baseStr = "You found the Jailbrick. You now have Jailbird.";
        return baseStr;
    };
    Jailbird.calculateTier = function (player) {
        return player.$collectibles.has('Jail Brick') ? 1 : 0;
    };
    Jailbird.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: 'Jailbird' }
        ];
        return baseRewards;
    };
    Jailbird.statWatches = ['Item/Collectible/Find'];
    Jailbird.type = interfaces_1.AchievementType.Explore;
    return Jailbird;
}(interfaces_1.Achievement));
exports.Jailbird = Jailbird;
//# sourceMappingURL=Jailbird.js.map