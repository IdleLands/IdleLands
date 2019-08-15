"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var interfaces_1 = require("../../../../shared/interfaces");
var Necromancer = /** @class */ (function (_super) {
    tslib_1.__extends(Necromancer, _super);
    function Necromancer() {
        var _a, _b, _c, _d;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.specialStatName = 'Minion';
        _this.oocAbilityName = 'Bone Minions';
        _this.oocAbilityDesc = 'Summon extra minions to join you in your next few combats.';
        _this.oocAbilityCost = 40;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 2,
                _b[Stat_1.Stat.INT] = 5,
                _b),
            _a);
        _this.statMultipliers = (_c = {},
            _c[Stat_1.Stat.HP] = 1,
            _c[Stat_1.Stat.STR] = 0.5,
            _c[Stat_1.Stat.DEX] = 0.5,
            _c[Stat_1.Stat.INT] = 3,
            _c[Stat_1.Stat.CON] = 0.5,
            _c[Stat_1.Stat.AGI] = 0.3,
            _c[Stat_1.Stat.LUK] = 0.1,
            _c[Stat_1.Stat.SPECIAL] = 0,
            _c[Stat_1.Stat.XP] = 1,
            _c[Stat_1.Stat.GOLD] = 1,
            _c);
        _this.statsPerLevel = (_d = {},
            _d[Stat_1.Stat.HP] = 5,
            _d[Stat_1.Stat.STR] = 1,
            _d[Stat_1.Stat.DEX] = 1,
            _d[Stat_1.Stat.INT] = 4,
            _d[Stat_1.Stat.CON] = 1,
            _d[Stat_1.Stat.AGI] = 0,
            _d[Stat_1.Stat.LUK] = 1,
            _d[Stat_1.Stat.SPECIAL] = 0,
            _d[Stat_1.Stat.XP] = 0.6,
            _d[Stat_1.Stat.GOLD] = 0,
            _d);
        return _this;
    }
    Necromancer.prototype.oocAbility = function (player) {
        var _a;
        player.grantBuff({
            name: 'Bone Minions',
            statistic: 'Combat/All/Times/Total',
            booster: true,
            duration: 5 + player.ascensionLevel,
            permanentStats: (_a = {},
                _a[interfaces_1.PermanentUpgrade.MaxPetsInCombat] = 2 + Math.floor(Math.log(player.ascensionLevel)),
                _a)
        }, true);
        this.emitProfessionMessage(player, 'You summoned some bone minions!');
        return "You summoned some bone minions!";
    };
    Necromancer.prototype.determineStartingSpecial = function () {
        return 0;
    };
    Necromancer.prototype.determineMaxSpecial = function () {
        return 3;
    };
    return Necromancer;
}(Profession_1.BaseProfession));
exports.Necromancer = Necromancer;
//# sourceMappingURL=Necromancer.js.map