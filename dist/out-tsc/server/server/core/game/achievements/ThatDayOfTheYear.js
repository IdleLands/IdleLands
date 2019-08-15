"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var ThatDayOfTheYear = /** @class */ (function (_super) {
    tslib_1.__extends(ThatDayOfTheYear, _super);
    function ThatDayOfTheYear() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ThatDayOfTheYear.descriptionForTier = function (tier) {
        var baseStr = "Personality: Gullible";
        return baseStr;
    };
    ThatDayOfTheYear.calculateTier = function (player) {
        var date = new Date();
        return date.getUTCMonth() + 1 === 4 && date.getUTCDate() === 1 ? 1 : 0;
    };
    ThatDayOfTheYear.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Personality, personality: 'Gullible' },
        ];
        return baseRewards;
    };
    ThatDayOfTheYear.statWatches = ['Game/Logins'];
    ThatDayOfTheYear.type = interfaces_1.AchievementType.Explore;
    return ThatDayOfTheYear;
}(interfaces_1.Achievement));
exports.ThatDayOfTheYear = ThatDayOfTheYear;
//# sourceMappingURL=ThatDayOfTheYear.js.map