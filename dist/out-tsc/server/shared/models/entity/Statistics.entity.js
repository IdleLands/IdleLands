"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var lodash_1 = require("lodash");
var PlayerOwned_1 = require("./PlayerOwned");
/**
 * Super-categories:
 * - Game (tracks logins, other game metadata)
 * - Character (tracks character-specific stats)
 * - Event (tracks event-specific stats) (Event.{X}.Times/Other)
 * - Guild (tracks guild-specific stats) (Guild.{X})
 * - Item (tracks item-specific stats) (Item.{X})
 * - Profession (tracks profession-specific stats) (Profession.{X}.Steps/Times)
 * - Environment (tracks environment-specific stats) (Environment.Terrain.{X})
 * - Pet (tracks pet-specific stats)
 * - BossKill (tracks boss kills)
 * - Combat (tracks combat-related stats)
 * - Map (tracks map visits)
 */
var Statistics = /** @class */ (function (_super) {
    tslib_1.__extends(Statistics, _super);
    function Statistics() {
        var _this = _super.call(this) || this;
        if (!_this.statistics)
            _this.statistics = {};
        return _this;
    }
    Object.defineProperty(Statistics.prototype, "$statisticsData", {
        get: function () {
            return this.statistics;
        },
        enumerable: true,
        configurable: true
    });
    Statistics.prototype.increase = function (stat, value) {
        if (value === void 0) { value = 1; }
        if (isNaN(value))
            throw new Error(stat + " being incremented by NaN!");
        if (stat.includes('.'))
            throw new Error(stat + " path contains a \".\"! Use \"/\" instead.");
        var curVal = this.get(stat);
        this.set(stat, Math.floor(curVal + value));
    };
    Statistics.prototype.get = function (stat) {
        if (stat.includes('.'))
            throw new Error(stat + " path contains a \".\"! Use \"/\" instead.");
        return lodash_1.get(this.statistics, stat.split('/'), 0);
    };
    Statistics.prototype.set = function (stat, value) {
        if (isNaN(value))
            throw new Error(stat + " being set to NaN!");
        lodash_1.set(this.statistics, stat.split('/'), value);
    };
    Statistics.prototype.getChildren = function (stat) {
        return Object.keys(this.get(stat));
    };
    Statistics.prototype.getChildrenCount = function (stat) {
        var statB = this.get(stat);
        return lodash_1.isNumber(statB) ? statB : Object.keys(statB).length;
    };
    tslib_1.__decorate([
        typeorm_1.ObjectIdColumn(),
        tslib_1.__metadata("design:type", String)
    ], Statistics.prototype, "_id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Statistics.prototype, "statistics", void 0);
    Statistics = tslib_1.__decorate([
        typeorm_1.Entity(),
        tslib_1.__metadata("design:paramtypes", [])
    ], Statistics);
    return Statistics;
}(PlayerOwned_1.PlayerOwned));
exports.Statistics = Statistics;
//# sourceMappingURL=Statistics.entity.js.map