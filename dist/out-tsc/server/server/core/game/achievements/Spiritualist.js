"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Spiritualist = /** @class */ (function (_super) {
    tslib_1.__extends(Spiritualist, _super);
    function Spiritualist() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Spiritualist.descriptionForTier = function (tier) {
        var baseStr = "Gain a title for upgrading all of the ghostly pets.";
        return baseStr;
    };
    Spiritualist.calculateTier = function (player) {
        if (!player.$petsData)
            return 0;
        var pets = player.$petsData.allPets;
        if (!pets['Spellbook'] || !pets['Ghostly Sword'] || !pets['Ghostly Shield'])
            return 0;
        return pets['Spellbook'].rating === 5
            && pets['Ghostly Sword'].rating === 5
            && pets['Ghostly Shield'].rating === 5
            ? 1 : 0;
    };
    Spiritualist.rewardsForTier = function (tier) {
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: 'Spiritualist' }
        ];
        return baseRewards;
    };
    Spiritualist.statWatches = ['Pet/Upgrade/Times'];
    Spiritualist.type = interfaces_1.AchievementType.Special;
    return Spiritualist;
}(interfaces_1.Achievement));
exports.Spiritualist = Spiritualist;
//# sourceMappingURL=Spiritualist.js.map