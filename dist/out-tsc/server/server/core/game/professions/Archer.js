"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var interfaces_1 = require("../../../../shared/interfaces");
var Archer = /** @class */ (function (_super) {
    tslib_1.__extends(Archer, _super);
    function Archer() {
        var _a, _b, _c, _d, _e;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.specialStatName = 'Arrow';
        _this.oocAbilityName = 'Pet Phenomenon';
        _this.oocAbilityDesc = 'Bring more pets to aid you in combat.';
        _this.oocAbilityCost = 30;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 3,
                _b[Stat_1.Stat.DEX] = 2,
                _b),
            _a[Stat_1.Stat.STR] = (_c = {},
                _c[Stat_1.Stat.DEX] = 1,
                _c),
            _a);
        _this.statMultipliers = (_d = {},
            _d[Stat_1.Stat.HP] = 3,
            _d[Stat_1.Stat.STR] = 1.5,
            _d[Stat_1.Stat.DEX] = 2.5,
            _d[Stat_1.Stat.INT] = 0.8,
            _d[Stat_1.Stat.CON] = 1,
            _d[Stat_1.Stat.AGI] = 0.9,
            _d[Stat_1.Stat.LUK] = 0.9,
            _d[Stat_1.Stat.SPECIAL] = 0,
            _d[Stat_1.Stat.XP] = 1,
            _d[Stat_1.Stat.GOLD] = 1,
            _d);
        _this.statsPerLevel = (_e = {},
            _e[Stat_1.Stat.HP] = 15,
            _e[Stat_1.Stat.STR] = 1,
            _e[Stat_1.Stat.DEX] = 4,
            _e[Stat_1.Stat.INT] = 1,
            _e[Stat_1.Stat.CON] = 2,
            _e[Stat_1.Stat.AGI] = 1,
            _e[Stat_1.Stat.LUK] = 1,
            _e[Stat_1.Stat.SPECIAL] = 1,
            _e[Stat_1.Stat.XP] = 0.2,
            _e[Stat_1.Stat.GOLD] = 0,
            _e);
        return _this;
    }
    Archer.prototype.oocAbility = function (player) {
        var _a;
        player.grantBuff({
            name: 'Pheromone',
            statistic: 'Combat/All/Times/Total',
            booster: true,
            duration: 5 + player.ascensionLevel,
            permanentStats: (_a = {},
                _a[interfaces_1.PermanentUpgrade.MaxPetsInCombat] = 1 + Math.floor(Math.log(player.ascensionLevel)),
                _a)
        }, true);
        this.emitProfessionMessage(player, 'You used your special ability to bring more pets into combat!');
        return "More pets will join you in combat!";
    };
    return Archer;
}(Profession_1.BaseProfession));
exports.Archer = Archer;
//# sourceMappingURL=Archer.js.map