"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Slayer = /** @class */ (function (_super) {
    tslib_1.__extends(Slayer, _super);
    function Slayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Slayer.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 3 + "% STR/INT for killing " + Math.pow(Slayer.base, tier).toLocaleString() + " monsters.";
        if (tier >= 3) {
            baseStr = baseStr + " Title: Culler of Herds.";
        }
        if (tier >= 5) {
            baseStr = baseStr + " Title: Slayer of Beasts.";
        }
        return baseStr;
    };
    Slayer.calculateTier = function (player) {
        var steps = player.$statistics.get('Combat/All/Kill/Monster');
        return Math.floor(interfaces_1.Achievement.log(steps, Slayer.base));
    };
    Slayer.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.STR] = 1 + (tier * 0.03),
                    _a[interfaces_1.Stat.INT] = 1 + (tier * 0.03),
                    _a) }
        ];
        if (tier >= 3) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Culler of Herds' });
        }
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Slayer of Beasts' });
        }
        return baseRewards;
    };
    Slayer.base = 10;
    Slayer.statWatches = ['Combat/All/Kill/Monster'];
    Slayer.type = interfaces_1.AchievementType.Combat;
    return Slayer;
}(interfaces_1.Achievement));
exports.Slayer = Slayer;
//# sourceMappingURL=Slayer.js.map