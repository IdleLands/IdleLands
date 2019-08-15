"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Fallen = /** @class */ (function (_super) {
    tslib_1.__extends(Fallen, _super);
    function Fallen() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Fallen.descriptionForTier = function (tier) {
        var baseStr = "Gain a title for falling. A lot.";
        return baseStr;
    };
    Fallen.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Movement/Fall');
        return steps >= Fallen.base ? 1 : 0;
    };
    Fallen.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: 'Fallen' }
        ];
        return baseRewards;
    };
    Fallen.base = 5000;
    Fallen.statWatches = ['Character/Movement/Fall'];
    Fallen.type = interfaces_1.AchievementType.Special;
    return Fallen;
}(interfaces_1.Achievement));
exports.Fallen = Fallen;
//# sourceMappingURL=Fallen.js.map