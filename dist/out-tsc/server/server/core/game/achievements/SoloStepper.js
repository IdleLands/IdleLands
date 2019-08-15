"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var SoloStepper = /** @class */ (function (_super) {
    tslib_1.__extends(SoloStepper, _super);
    function SoloStepper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SoloStepper.descriptionForTier = function (tier) {
        var baseStr = "Gain a title and +5 max stamina for solo-stepping 100,000 times.";
        if (tier >= 2) {
            baseStr = baseStr + " Title: Solo Scorpion.";
        }
        return baseStr;
    };
    SoloStepper.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Movement/Steps/Solo');
        if (steps >= 1000000)
            return 2;
        if (steps >= 100000)
            return 1;
        return 0;
    };
    SoloStepper.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_a = {}, _a[interfaces_1.PermanentUpgrade.MaxStaminaBoost] = 5, _a) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'Sole Foot' }
        ];
        if (tier >= 2) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Solo Scorpion' });
        }
        return baseRewards;
    };
    SoloStepper.statWatches = ['Character/Movement/Steps/Solo'];
    SoloStepper.type = interfaces_1.AchievementType.Event;
    return SoloStepper;
}(interfaces_1.Achievement));
exports.SoloStepper = SoloStepper;
//# sourceMappingURL=SoloStepper.js.map