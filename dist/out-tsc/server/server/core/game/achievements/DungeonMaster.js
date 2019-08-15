"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var DungeonMaster = /** @class */ (function (_super) {
    tslib_1.__extends(DungeonMaster, _super);
    function DungeonMaster() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DungeonMaster.descriptionForTier = function (tier) {
        var baseStr = "Gain a title (Dungeon Master) and a gender (sentient sword) for getting the Sword in the Stone.";
        return baseStr;
    };
    DungeonMaster.calculateTier = function (player) {
        return player.$collectibles.has('Sword in the Stones') ? 1 : 0;
    };
    DungeonMaster.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: 'Dungeon Master' },
            { type: interfaces_1.AchievementRewardType.Gender, gender: 'sentient sword' }
        ];
        return baseRewards;
    };
    DungeonMaster.statWatches = ['Item/Collectible/Touch'];
    DungeonMaster.type = interfaces_1.AchievementType.Special;
    return DungeonMaster;
}(interfaces_1.Achievement));
exports.DungeonMaster = DungeonMaster;
//# sourceMappingURL=DungeonMaster.js.map