"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var AnimalAdmiral = /** @class */ (function (_super) {
    tslib_1.__extends(AnimalAdmiral, _super);
    function AnimalAdmiral() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimalAdmiral.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 2 + "% STR for using pet abilities " + Math.pow(AnimalAdmiral.base, tier).toLocaleString() + " times.";
        if (tier >= 4) {
            baseStr = baseStr + " Pet Attribute: Ferocious.";
        }
        if (tier >= 5) {
            baseStr = baseStr + " Title: Animal Admiral.";
        }
        return baseStr;
    };
    AnimalAdmiral.calculateTier = function (player) {
        var steps = player.$statistics.get('Pet/AbilityUses/Total');
        return Math.floor(interfaces_1.Achievement.log(steps, AnimalAdmiral.base));
    };
    AnimalAdmiral.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.STR] = 1 + (tier * 0.02),
                    _a) },
        ];
        if (tier >= 4) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.PetAttribute, petattr: interfaces_1.PetAttribute.Ferocious });
        }
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Animal Admiral' });
        }
        return baseRewards;
    };
    AnimalAdmiral.base = 4;
    AnimalAdmiral.statWatches = ['Pet/AbilityUses/Total'];
    AnimalAdmiral.type = interfaces_1.AchievementType.Special;
    return AnimalAdmiral;
}(interfaces_1.Achievement));
exports.AnimalAdmiral = AnimalAdmiral;
//# sourceMappingURL=AnimalAdmiral.js.map