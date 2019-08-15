"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Camper = /** @class */ (function (_super) {
    tslib_1.__extends(Camper, _super);
    function Camper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Camper.descriptionForTier = function (tier) {
        var baseStr = "Gain a title and +5 max stamina for camp-sleeping 100,000 times.";
        if (tier >= 2) {
            baseStr = baseStr + " Title: Camping Camel.";
        }
        return baseStr;
    };
    Camper.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Movement/Steps/Camping');
        if (steps >= 1000000)
            return 2;
        if (steps >= 100000)
            return 1;
        return 0;
    };
    Camper.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_a = {}, _a[interfaces_1.PermanentUpgrade.MaxStaminaBoost] = 5, _a) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'Happy Camper' }
        ];
        if (tier >= 2) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Camping Camel' });
        }
        return baseRewards;
    };
    Camper.statWatches = ['Character/Movement/Steps/Camping'];
    Camper.type = interfaces_1.AchievementType.Event;
    return Camper;
}(interfaces_1.Achievement));
exports.Camper = Camper;
//# sourceMappingURL=Camper.js.map