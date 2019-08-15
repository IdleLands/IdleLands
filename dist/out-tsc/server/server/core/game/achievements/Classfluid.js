"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Professions = require("../professions");
var Classfluid = /** @class */ (function (_super) {
    tslib_1.__extends(Classfluid, _super);
    function Classfluid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Classfluid.descriptionForTier = function () {
        return 'Gain +10% to all stats for becoming each class once.';
    };
    Classfluid.calculateTier = function (player) {
        var uniqueClasses = player.$statistics.getChildrenCount('Profession');
        return uniqueClasses === Object.keys(Professions).length ? 1 : 0;
    };
    Classfluid.rewardsForTier = function () {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.STR] = 1.1,
                    _a[interfaces_1.Stat.DEX] = 1.1,
                    _a[interfaces_1.Stat.CON] = 1.1,
                    _a[interfaces_1.Stat.INT] = 1.1,
                    _a[interfaces_1.Stat.AGI] = 1.1,
                    _a[interfaces_1.Stat.LUK] = 1.1,
                    _a) }
        ];
        return baseRewards;
    };
    Classfluid.statWatches = ['Character.ProfessionChanges'];
    Classfluid.type = interfaces_1.AchievementType.Progress;
    return Classfluid;
}(interfaces_1.Achievement));
exports.Classfluid = Classfluid;
//# sourceMappingURL=Classfluid.js.map