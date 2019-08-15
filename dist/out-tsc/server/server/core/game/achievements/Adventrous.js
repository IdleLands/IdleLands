"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Adventrous = /** @class */ (function (_super) {
    tslib_1.__extends(Adventrous, _super);
    function Adventrous() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Adventrous.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 5 + "% Item Stat Cap Boost for sending your pets on\n                  " + (tier * Adventrous.base).toLocaleString() + " hours of dangerous adventures.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Sender.";
        }
        if (tier >= 10) {
            baseStr = baseStr + " Title: Caller.";
        }
        if (tier >= 15) {
            baseStr = baseStr + " Title: Organizer.";
        }
        return baseStr;
    };
    Adventrous.calculateTier = function (player) {
        var steps = player.$statistics.get('Pet/Adventure/Hours');
        return Math.floor(steps / Adventrous.base);
    };
    Adventrous.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_a = {}, _a[interfaces_1.PermanentUpgrade.ItemStatCapBoost] = tier * 5, _a) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Sender' });
        }
        if (tier >= 10) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Caller' });
        }
        if (tier >= 15) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Organizer' });
        }
        return baseRewards;
    };
    Adventrous.base = 500;
    Adventrous.statWatches = ['Pet/Adventure/Hours'];
    Adventrous.type = interfaces_1.AchievementType.Explore;
    return Adventrous;
}(interfaces_1.Achievement));
exports.Adventrous = Adventrous;
//# sourceMappingURL=Adventrous.js.map