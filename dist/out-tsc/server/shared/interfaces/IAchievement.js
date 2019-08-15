"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AchievementType;
(function (AchievementType) {
    AchievementType["Progress"] = "progress";
    AchievementType["Explore"] = "explore";
    AchievementType["Combat"] = "combat";
    AchievementType["Special"] = "special";
    AchievementType["Event"] = "event";
    AchievementType["Pet"] = "pet";
})(AchievementType = exports.AchievementType || (exports.AchievementType = {}));
var AchievementRewardType;
(function (AchievementRewardType) {
    AchievementRewardType["Gender"] = "gender";
    AchievementRewardType["Stats"] = "stat#";
    AchievementRewardType["StatMultipliers"] = "stat%";
    AchievementRewardType["Pet"] = "pet";
    AchievementRewardType["PetAttribute"] = "petattr";
    AchievementRewardType["Title"] = "title";
    AchievementRewardType["DeathMessage"] = "deathmsg";
    AchievementRewardType["Personality"] = "personality";
    AchievementRewardType["PermanentUpgrade"] = "permanentupgrade";
})(AchievementRewardType = exports.AchievementRewardType || (exports.AchievementRewardType = {}));
var Achievement = /** @class */ (function () {
    function Achievement() {
    }
    Achievement.descriptionForTier = function (tier) {
        return "Error: no desc for ach";
    };
    Achievement.calculateTier = function (player) {
        return 1;
    };
    Achievement.rewardsForTier = function (tier) {
        return [];
    };
    Achievement.log = function (num, base) {
        // hard return case for situations where you have a stat at 0
        if (num === 0)
            return 0;
        return Math.log(num) / Math.log(base);
    };
    Achievement.base = 1;
    Achievement.type = AchievementType.Special;
    return Achievement;
}());
exports.Achievement = Achievement;
//# sourceMappingURL=IAchievement.js.map