"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Bossy = /** @class */ (function (_super) {
    tslib_1.__extends(Bossy, _super);
    function Bossy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bossy.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 3 + "% CON/AGI for killing " + (tier * Bossy.base).toLocaleString() + " bosses.";
        if (tier >= 2) {
            baseStr = baseStr + " Personality: Seeker.";
        }
        if (tier >= 5) {
            baseStr = baseStr + " Title: Bossy Banana.";
        }
        if (tier >= 15) {
            baseStr = baseStr + " Gender: green boss monster.";
        }
        if (tier >= 30) {
            baseStr = baseStr + " Gender: blue boss monster.";
        }
        return baseStr;
    };
    Bossy.calculateTier = function (player) {
        var steps = player.$statistics.get('BossKill/Total');
        return Math.floor(steps / Bossy.base);
    };
    Bossy.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.CON] = 1 + (tier * 0.03),
                    _a[interfaces_1.Stat.AGI] = 1 + (tier * 0.03),
                    _a) }
        ];
        if (tier >= 2) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Personality, personality: 'Seeker' });
        }
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Bossy Banana' });
        }
        if (tier >= 15) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Gender, gender: 'green boss monster' });
        }
        if (tier >= 30) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Gender, gender: 'blue boss monster' });
        }
        return baseRewards;
    };
    Bossy.base = 25;
    Bossy.statWatches = ['BossKill/Total'];
    Bossy.type = interfaces_1.AchievementType.Combat;
    return Bossy;
}(interfaces_1.Achievement));
exports.Bossy = Bossy;
//# sourceMappingURL=Bossy.js.map