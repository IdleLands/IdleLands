"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Scrambler = /** @class */ (function (_super) {
    tslib_1.__extends(Scrambler, _super);
    function Scrambler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Scrambler.descriptionForTier = function (tier) {
        var baseStr = "Gain a title and pet attribute (Teleseer) for teleporting frequently.";
        return baseStr;
    };
    Scrambler.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Movement/Teleporter');
        return steps >= Scrambler.base ? 1 : 0;
    };
    Scrambler.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: 'Lover of Eggs' },
            { type: interfaces_1.AchievementRewardType.PetAttribute, petattr: interfaces_1.PetAttribute.Trueseer }
        ];
        return baseRewards;
    };
    Scrambler.base = 5000;
    Scrambler.statWatches = ['Character/Movement/Teleport'];
    Scrambler.type = interfaces_1.AchievementType.Special;
    return Scrambler;
}(interfaces_1.Achievement));
exports.Scrambler = Scrambler;
//# sourceMappingURL=Scrambler.js.map