"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Partier = /** @class */ (function (_super) {
    tslib_1.__extends(Partier, _super);
    function Partier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Partier.descriptionForTier = function (tier) {
        var baseStr = "Gain three personalities (Solo, Leader, Follower) for party-stepping 10,000 times.";
        if (tier >= 2) {
            baseStr = baseStr + " Title: Synergistic. Personality: Telesheep. +5 max stamina.";
        }
        if (tier >= 3) {
            baseStr = baseStr + " Title: Party Parakeet.";
        }
        return baseStr;
    };
    Partier.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Movement/Steps/Party');
        if (steps >= 1000000)
            return 3;
        if (steps >= 100000)
            return 2;
        if (steps >= 10000)
            return 1;
        return 0;
    };
    Partier.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Personality, personality: 'Solo' },
            { type: interfaces_1.AchievementRewardType.Personality, personality: 'Leader' },
            { type: interfaces_1.AchievementRewardType.Personality, personality: 'Follower' }
        ];
        if (tier >= 2) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_a = {}, _a[interfaces_1.PermanentUpgrade.MaxStaminaBoost] = 5, _a) });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Personality, personality: 'Telesheep' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Synergistic' });
        }
        if (tier >= 3) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Party Parakeet' });
        }
        return baseRewards;
    };
    Partier.statWatches = ['Character/Movement/Steps/Party'];
    Partier.type = interfaces_1.AchievementType.Event;
    return Partier;
}(interfaces_1.Achievement));
exports.Partier = Partier;
//# sourceMappingURL=Partier.js.map