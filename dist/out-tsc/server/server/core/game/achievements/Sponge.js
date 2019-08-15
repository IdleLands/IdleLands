"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Sponge = /** @class */ (function (_super) {
    tslib_1.__extends(Sponge, _super);
    function Sponge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sponge.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 5 + "% CON for taking " + Math.pow(Sponge.base, tier).toLocaleString() + " damage.";
        if (tier >= 3) {
            baseStr = baseStr + " Personality: Fortuitous.";
        }
        if (tier >= 5) {
            baseStr = baseStr + " Title: Porifera.";
        }
        return baseStr;
    };
    Sponge.calculateTier = function (player) {
        var steps = player.$statistics.get('Combat/All/Receive/Damage');
        return Math.floor(interfaces_1.Achievement.log(steps, Sponge.base));
    };
    Sponge.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.CON] = 1 + (tier * 0.05),
                    _a) }
        ];
        if (tier >= 3) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Personality, personality: 'Fortuitous' });
        }
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Porifera' });
        }
        return baseRewards;
    };
    Sponge.base = 10;
    Sponge.statWatches = ['Combat/All/Receive/Damage'];
    Sponge.type = interfaces_1.AchievementType.Combat;
    return Sponge;
}(interfaces_1.Achievement));
exports.Sponge = Sponge;
//# sourceMappingURL=Sponge.js.map