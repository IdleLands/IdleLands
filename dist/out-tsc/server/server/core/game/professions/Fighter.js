"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var Fighter = /** @class */ (function (_super) {
    tslib_1.__extends(Fighter, _super);
    function Fighter() {
        var _a, _b, _c, _d;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Experiencer';
        _this.oocAbilityDesc = 'Give your party an XP buff based on your LUK.';
        _this.oocAbilityCost = 20;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 5,
                _b[Stat_1.Stat.STR] = 2,
                _b),
            _a);
        _this.statMultipliers = (_c = {},
            _c[Stat_1.Stat.HP] = 5,
            _c[Stat_1.Stat.STR] = 2.5,
            _c[Stat_1.Stat.DEX] = 1.5,
            _c[Stat_1.Stat.INT] = 0.4,
            _c[Stat_1.Stat.CON] = 1.3,
            _c[Stat_1.Stat.AGI] = 1.1,
            _c[Stat_1.Stat.LUK] = 0.7,
            _c[Stat_1.Stat.SPECIAL] = 0,
            _c[Stat_1.Stat.XP] = 1,
            _c[Stat_1.Stat.GOLD] = 1,
            _c);
        _this.statsPerLevel = (_d = {},
            _d[Stat_1.Stat.HP] = 25,
            _d[Stat_1.Stat.STR] = 3,
            _d[Stat_1.Stat.DEX] = 2,
            _d[Stat_1.Stat.INT] = 1,
            _d[Stat_1.Stat.CON] = 2,
            _d[Stat_1.Stat.AGI] = 1,
            _d[Stat_1.Stat.LUK] = 1,
            _d[Stat_1.Stat.SPECIAL] = 0,
            _d[Stat_1.Stat.XP] = 0.3,
            _d[Stat_1.Stat.GOLD] = 0,
            _d);
        return _this;
    }
    Fighter.prototype.oocAbility = function (player) {
        var _a;
        var luk = player.getStat(Stat_1.Stat.LUK);
        player.grantBuff({
            name: 'Experiencer',
            statistic: 'Character/Ticks',
            booster: true,
            duration: 720,
            stats: (_a = {},
                _a[Stat_1.Stat.XP] = Math.log(luk) * Math.log(player.level.total),
                _a)
        }, true);
        this.emitProfessionMessage(player, "Your XP gain will be increased for 720 ticks!");
        return "Your XP gain will be increased for 720 ticks!";
    };
    return Fighter;
}(Profession_1.BaseProfession));
exports.Fighter = Fighter;
//# sourceMappingURL=Fighter.js.map