"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var lodash_1 = require("lodash");
var PlayerOwned_1 = require("./PlayerOwned");
var interfaces_1 = require("../../interfaces");
var Achievements = /** @class */ (function (_super) {
    tslib_1.__extends(Achievements, _super);
    function Achievements() {
        var _this = _super.call(this) || this;
        if (!_this.achievements)
            _this.achievements = {};
        return _this;
    }
    Object.defineProperty(Achievements.prototype, "$achievementsData", {
        get: function () {
            return { achievements: this.achievements };
        },
        enumerable: true,
        configurable: true
    });
    Achievements.prototype.init = function (player) {
        player.$$game.achievementManager.checkAchievementsFor(player);
    };
    Achievements.prototype.add = function (ach) {
        this.achievements[ach.name] = ach;
    };
    Achievements.prototype.getAchievementAchieved = function (achName) {
        return lodash_1.get(this.achievements, [achName, 'achievedAt'], 0);
    };
    Achievements.prototype.getAchievementTier = function (achName) {
        return lodash_1.get(this.achievements, [achName, 'tier'], 0);
    };
    Achievements.prototype.resetAchievementsTo = function (ach) {
        var _this = this;
        this.achievements = {};
        ach.forEach(function (achi) { return _this.add(achi); });
    };
    Achievements.prototype.totalAchievements = function () {
        return Object.keys(this.achievements).length;
    };
    Achievements.prototype.totalAchievementTiers = function () {
        return Object.values(this.achievements).reduce(function (prev, cur) { return prev + cur.tier; }, 0);
    };
    Achievements.prototype.getPermanentUpgrades = function () {
        return Object.values(this.achievements).reduce(function (prev, ach) {
            var rewards = lodash_1.compact(ach.rewards
                .filter(function (reward) { return reward.type === interfaces_1.AchievementRewardType.PermanentUpgrade; }));
            rewards.forEach(function (reward) {
                Object.keys(reward.upgrades).forEach(function (upgrade) {
                    prev[upgrade] = prev[upgrade] || 0;
                    prev[upgrade] += reward.upgrades[upgrade];
                });
            });
            return prev;
        }, {});
    };
    Achievements.prototype.getTitles = function () {
        return lodash_1.sortBy(lodash_1.flatten(Object.values(this.achievements).map(function (ach) {
            return lodash_1.compact(ach.rewards
                .filter(function (reward) { return reward.type === interfaces_1.AchievementRewardType.Title; })
                .map(function (reward) { return reward.title; }));
        })));
    };
    Achievements.prototype.getPersonalities = function () {
        return lodash_1.sortBy(lodash_1.flatten(Object.values(this.achievements).map(function (ach) {
            return lodash_1.compact(ach.rewards
                .filter(function (reward) { return reward.type === interfaces_1.AchievementRewardType.Personality; })
                .map(function (reward) { return reward.personality; }));
        })));
    };
    Achievements.prototype.getPets = function () {
        return lodash_1.sortBy(lodash_1.flatten(Object.values(this.achievements).map(function (ach) {
            return lodash_1.compact(ach.rewards
                .filter(function (reward) { return reward.type === interfaces_1.AchievementRewardType.Pet; })
                .map(function (reward) { return reward.pet; }));
        })));
    };
    Achievements.prototype.getGenders = function () {
        var base = ['male', 'female', 'not a bear', 'glowcloud', 'astronomical entity', 'soap'];
        return base.concat(lodash_1.flatten(Object.values(this.achievements).map(function (ach) {
            return lodash_1.compact(ach.rewards
                .filter(function (reward) { return reward.type === interfaces_1.AchievementRewardType.Gender; })
                .map(function (reward) { return reward.gender; }));
        })));
    };
    Achievements.prototype.getPetAttributes = function () {
        var base = [interfaces_1.PetAttribute.Cursed];
        return base.concat(lodash_1.flatten(Object.values(this.achievements).map(function (ach) {
            return lodash_1.compact(ach.rewards
                .filter(function (reward) { return reward.type === interfaces_1.AchievementRewardType.PetAttribute; })
                .map(function (reward) { return reward.petattr; }));
        })));
    };
    tslib_1.__decorate([
        typeorm_1.ObjectIdColumn(),
        tslib_1.__metadata("design:type", String)
    ], Achievements.prototype, "_id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Achievements.prototype, "achievements", void 0);
    Achievements = tslib_1.__decorate([
        typeorm_1.Entity(),
        tslib_1.__metadata("design:paramtypes", [])
    ], Achievements);
    return Achievements;
}(PlayerOwned_1.PlayerOwned));
exports.Achievements = Achievements;
//# sourceMappingURL=Achievements.entity.js.map