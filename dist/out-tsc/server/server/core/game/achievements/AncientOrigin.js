"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var AncientOrigin = /** @class */ (function (_super) {
    tslib_1.__extends(AncientOrigin, _super);
    function AncientOrigin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AncientOrigin.descriptionForTier = function (tier) {
        var baseStr = "Gain a title for playing IdleLands 1. That's all you get. Nothing from that era was transferrable.";
        return baseStr;
    };
    AncientOrigin.calculateTier = function (player) {
        return player.$statistics.get('Game/IdleLands1/Played') ? 1 : 0;
    };
    AncientOrigin.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: 'Origin of the Idling Gods 🌊' }
        ];
        return baseRewards;
    };
    AncientOrigin.statWatches = ['Game/IdleLands1/Played'];
    AncientOrigin.type = interfaces_1.AchievementType.Special;
    return AncientOrigin;
}(interfaces_1.Achievement));
exports.AncientOrigin = AncientOrigin;
//# sourceMappingURL=AncientOrigin.js.map