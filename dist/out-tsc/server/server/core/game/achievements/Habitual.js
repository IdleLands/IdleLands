"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Habitual = /** @class */ (function (_super) {
    tslib_1.__extends(Habitual, _super);
    function Habitual() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Habitual.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier + "% Item Cap Boost rolling Free Gate " + (tier * Habitual.base).toLocaleString() + " days.";
        if (tier >= 4) {
            baseStr = baseStr + " Title: Monthly Roller.";
        }
        if (tier >= 13) {
            baseStr = baseStr + " Title: Quarterly Roller.";
        }
        if (tier >= 26) {
            baseStr = baseStr + " Title: Halfly Roller.";
        }
        if (tier >= 52) {
            baseStr = baseStr + " Title: Yearly Roller.";
        }
        return baseStr;
    };
    Habitual.calculateTier = function (player) {
        var steps = player.$statistics.get('Astral Gate/Roll/Free');
        return Math.floor(steps / Habitual.base);
    };
    Habitual.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_a = {}, _a[interfaces_1.PermanentUpgrade.ItemStatCapBoost] = tier, _a) }
        ];
        if (tier >= 4) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Monthly Roller' });
        }
        if (tier >= 13) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Quarterly Roller' });
        }
        if (tier >= 26) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Halfly Roller' });
        }
        if (tier >= 52) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Yearly Roller' });
        }
        return baseRewards;
    };
    Habitual.base = 7;
    Habitual.statWatches = ['Astral Gate/Roll/Free'];
    Habitual.type = interfaces_1.AchievementType.Special;
    return Habitual;
}(interfaces_1.Achievement));
exports.Habitual = Habitual;
//# sourceMappingURL=Habitual.js.map