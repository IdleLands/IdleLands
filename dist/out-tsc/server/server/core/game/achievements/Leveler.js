"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Leveler = /** @class */ (function (_super) {
    tslib_1.__extends(Leveler, _super);
    function Leveler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Leveler.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 5 + "% more XP and GOLD +1 Adventure Log Size for leveling " + tier * 25 + " time(s).";
        var divisor = Math.floor(tier / 4);
        if (divisor > 0) {
            baseStr = baseStr + " +" + divisor * 25 + "% Item Stat Cap Boost.";
        }
        return baseStr;
    };
    Leveler.calculateTier = function (player) {
        return Math.floor(player.level.total / 25);
    };
    Leveler.rewardsForTier = function (tier) {
        var _a, _b, _c;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.XP] = 1 + (tier * 0.05),
                    _a[interfaces_1.Stat.GOLD] = 1 + (tier * 0.05),
                    _a) },
            { type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_b = {}, _b[interfaces_1.PermanentUpgrade.AdventureLogSizeBoost] = tier, _b) }
        ];
        var divisor = Math.floor(tier / 4);
        if (divisor > 0) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_c = {}, _c[interfaces_1.PermanentUpgrade.ItemStatCapBoost] = divisor * 25, _c) });
        }
        return baseRewards;
    };
    Leveler.base = 25;
    Leveler.statWatches = ['Character/Experience/Levels'];
    Leveler.type = interfaces_1.AchievementType.Progress;
    return Leveler;
}(interfaces_1.Achievement));
exports.Leveler = Leveler;
//# sourceMappingURL=Leveler.js.map