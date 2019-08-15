"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Fool = /** @class */ (function (_super) {
    tslib_1.__extends(Fool, _super);
    function Fool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Fool.descriptionForTier = function (tier) {
        var baseStr = "Gain the Drunk personality.";
        return baseStr;
    };
    Fool.calculateTier = function (player) {
        return player.level.total >= 18 ? 1 : 0;
    };
    Fool.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Personality, personality: 'Drunk' }
        ];
        return baseRewards;
    };
    Fool.base = 18;
    Fool.statWatches = ['Character/Experience/Levels'];
    Fool.type = interfaces_1.AchievementType.Progress;
    return Fool;
}(interfaces_1.Achievement));
exports.Fool = Fool;
//# sourceMappingURL=Fool.js.map