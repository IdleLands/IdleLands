"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var interfaces_1 = require("../../../../shared/interfaces");
var BaseAttribute = /** @class */ (function () {
    function BaseAttribute() {
    }
    Object.defineProperty(BaseAttribute.prototype, "$professionData", {
        get: function () {
            return {
                oocAbilityDesc: this.oocAbilityDesc,
                oocAbilityName: this.oocAbilityName,
                oocAbilityCost: this.oocAbilityCost
            };
        },
        enumerable: true,
        configurable: true
    });
    BaseAttribute.prototype.oocAbility = function (player) {
        return '';
    };
    return BaseAttribute;
}());
exports.BaseAttribute = BaseAttribute;
var BaseAffinity = /** @class */ (function () {
    function BaseAffinity() {
        var _a, _b, _c, _d;
        this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 1,
                _b),
            _a);
        this.statMultipliers = (_c = {},
            _c[Stat_1.Stat.HP] = 1,
            _c[Stat_1.Stat.STR] = 1,
            _c[Stat_1.Stat.DEX] = 1,
            _c[Stat_1.Stat.INT] = 1,
            _c[Stat_1.Stat.CON] = 1,
            _c[Stat_1.Stat.AGI] = 1,
            _c[Stat_1.Stat.LUK] = 1,
            _c[Stat_1.Stat.SPECIAL] = 0,
            _c[Stat_1.Stat.XP] = 1,
            _c[Stat_1.Stat.GOLD] = 1,
            _c);
        this.statsPerLevel = (_d = {},
            _d[Stat_1.Stat.HP] = 10,
            _d[Stat_1.Stat.STR] = 1,
            _d[Stat_1.Stat.DEX] = 1,
            _d[Stat_1.Stat.INT] = 1,
            _d[Stat_1.Stat.CON] = 1,
            _d[Stat_1.Stat.AGI] = 1,
            _d[Stat_1.Stat.LUK] = 1,
            _d[Stat_1.Stat.SPECIAL] = 0,
            _d[Stat_1.Stat.XP] = 0,
            _d[Stat_1.Stat.GOLD] = 0,
            _d);
    }
    BaseAffinity.prototype.calcLevelStat = function (playerLevel, stat) {
        return playerLevel * (this.statsPerLevel[stat] || 0);
    };
    BaseAffinity.prototype.calcStatMultiplier = function (stat) {
        return (this.statMultipliers[stat] || 1);
    };
    BaseAffinity.prototype.calcStatsForStats = function (stats, chosenStat) {
        var baseBoosts = this.statForStats[chosenStat];
        if (!baseBoosts)
            return [];
        return Object.keys(baseBoosts).map(function (boostedStat) {
            return {
                stat: boostedStat,
                boost: stats[boostedStat] * (baseBoosts[boostedStat] || 1),
                tinyBoost: baseBoosts[boostedStat]
            };
        });
    };
    return BaseAffinity;
}());
exports.BaseAffinity = BaseAffinity;
var BaseProfession = /** @class */ (function (_super) {
    tslib_1.__extends(BaseProfession, _super);
    function BaseProfession() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BaseProfession.prototype, "$professionData", {
        get: function () {
            return {
                oocAbilityDesc: this.oocAbilityDesc,
                oocAbilityName: this.oocAbilityName,
                oocAbilityCost: this.oocAbilityCost
            };
        },
        enumerable: true,
        configurable: true
    });
    BaseProfession.prototype.oocAbility = function (player) {
        return '';
    };
    BaseProfession.prototype.determineStartingSpecial = function (player) {
        return player.getStat(Stat_1.Stat.SPECIAL);
    };
    BaseProfession.prototype.determineMaxSpecial = function (player) {
        return player.getStat(Stat_1.Stat.SPECIAL);
    };
    BaseProfession.prototype.emitProfessionMessage = function (player, message) {
        player.$$game.subscriptionManager.emitToChannel(interfaces_1.Channel.PlayerAdventureLog, { playerNames: [player.name], data: {
                when: Date.now(),
                type: interfaces_1.AdventureLogEventType.Profession,
                message: message
            } });
    };
    return BaseProfession;
}(BaseAffinity));
exports.BaseProfession = BaseProfession;
//# sourceMappingURL=Profession.js.map