"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var Bitomancer = /** @class */ (function (_super) {
    tslib_1.__extends(Bitomancer, _super);
    function Bitomancer() {
        var _a, _b, _c, _d, _e;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.specialStatName = 'Bit';
        _this.oocAbilityName = 'Hack The System';
        _this.oocAbilityDesc = 'Improve your and your partys combat stats.';
        _this.oocAbilityCost = 30;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 5,
                _b),
            _a[Stat_1.Stat.SPECIAL] = (_c = {},
                _c[Stat_1.Stat.INT] = 2,
                _c),
            _a);
        _this.statMultipliers = (_d = {},
            _d[Stat_1.Stat.HP] = 0.9,
            _d[Stat_1.Stat.STR] = 0.3,
            _d[Stat_1.Stat.DEX] = 2,
            _d[Stat_1.Stat.INT] = 3,
            _d[Stat_1.Stat.CON] = 0.4,
            _d[Stat_1.Stat.AGI] = 0.5,
            _d[Stat_1.Stat.LUK] = 0.4,
            _d[Stat_1.Stat.SPECIAL] = 0,
            _d[Stat_1.Stat.XP] = 1,
            _d[Stat_1.Stat.GOLD] = 1,
            _d);
        _this.statsPerLevel = (_e = {},
            _e[Stat_1.Stat.HP] = 15,
            _e[Stat_1.Stat.STR] = 1,
            _e[Stat_1.Stat.DEX] = 3,
            _e[Stat_1.Stat.INT] = 4,
            _e[Stat_1.Stat.CON] = 1,
            _e[Stat_1.Stat.AGI] = 1,
            _e[Stat_1.Stat.LUK] = 1,
            _e[Stat_1.Stat.SPECIAL] = 4,
            _e[Stat_1.Stat.XP] = 0.7,
            _e[Stat_1.Stat.GOLD] = 0,
            _e);
        return _this;
    }
    Bitomancer.prototype.oocAbility = function (player) {
        var scaler = player.getStat(Stat_1.Stat.LUK) + player.getStat(Stat_1.Stat.INT);
        var stats = {};
        Object.values([Stat_1.Stat.STR, Stat_1.Stat.INT, Stat_1.Stat.CON]).forEach(function (stat) {
            stats[stat] = player.$$game.rngService.numberInRange(-5, Math.floor(Math.log(scaler) * player.level.total));
        });
        player.grantBuff({
            name: 'Bitomancer Hack',
            statistic: 'Combat/All/Times/Total',
            booster: true,
            duration: 3,
            stats: stats
        }, true);
        this.emitProfessionMessage(player, "You hacked the system!");
        return "You hacked the system!";
    };
    Bitomancer.prototype.determineStartingSpecial = function () {
        return 0;
    };
    return Bitomancer;
}(Profession_1.BaseProfession));
exports.Bitomancer = Bitomancer;
//# sourceMappingURL=Bitomancer.js.map