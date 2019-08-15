"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Newbie = /** @class */ (function (_super) {
    tslib_1.__extends(Newbie, _super);
    function Newbie() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Newbie.descriptionForTier = function (tier) {
        return "Welcome to IdleLands!\n      You get a base bonus of +5 XP.\n      You also get a starting title: Newbie.\n      Additionally, you get three personalities: Affirmer, Denier, Indecisive.";
    };
    Newbie.calculateTier = function (player) {
        return 1;
    };
    Newbie.rewardsForTier = function (tier) {
        var _a;
        return [
            { type: interfaces_1.AchievementRewardType.Stats, stats: (_a = {}, _a[interfaces_1.Stat.XP] = 5, _a) },
            { type: interfaces_1.AchievementRewardType.Title, title: 'Newbie' },
            { type: interfaces_1.AchievementRewardType.Personality, personality: 'Affirmer' },
            { type: interfaces_1.AchievementRewardType.Personality, personality: 'Denier' },
            { type: interfaces_1.AchievementRewardType.Personality, personality: 'Indecisive' }
        ];
    };
    Newbie.statWatches = [];
    Newbie.type = interfaces_1.AchievementType.Special;
    return Newbie;
}(interfaces_1.Achievement));
exports.Newbie = Newbie;
//# sourceMappingURL=Newbie.js.map