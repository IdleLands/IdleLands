"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Entitled = /** @class */ (function (_super) {
    tslib_1.__extends(Entitled, _super);
    function Entitled() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Entitled.descriptionForTier = function (tier) {
        var baseStr = "Gain a title (Entitled) for having 50 titles.";
        return baseStr;
    };
    Entitled.calculateTier = function (player) {
        var steps = player.$achievements.getTitles().length;
        return steps >= Entitled.base ? 1 : 0;
    };
    Entitled.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: 'Entitled' }
        ];
        return baseRewards;
    };
    Entitled.base = 50;
    Entitled.statWatches = ['Game/Logins'];
    Entitled.type = interfaces_1.AchievementType.Special;
    return Entitled;
}(interfaces_1.Achievement));
exports.Entitled = Entitled;
//# sourceMappingURL=Entitled.js.map