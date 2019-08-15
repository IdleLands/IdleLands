"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var Generalist = /** @class */ (function (_super) {
    tslib_1.__extends(Generalist, _super);
    function Generalist() {
        var _a, _b, _c, _d;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Generalize';
        _this.oocAbilityDesc = 'Gain XP based on your LUK.';
        _this.oocAbilityCost = 10;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 5,
                _b),
            _a);
        _this.statMultipliers = (_c = {},
            _c[Stat_1.Stat.HP] = 2,
            _c[Stat_1.Stat.STR] = 1,
            _c[Stat_1.Stat.DEX] = 1,
            _c[Stat_1.Stat.INT] = 1,
            _c[Stat_1.Stat.CON] = 2,
            _c[Stat_1.Stat.AGI] = 1,
            _c[Stat_1.Stat.LUK] = 2,
            _c[Stat_1.Stat.SPECIAL] = 0,
            _c[Stat_1.Stat.XP] = 1.1,
            _c[Stat_1.Stat.GOLD] = 1,
            _c);
        _this.statsPerLevel = (_d = {},
            _d[Stat_1.Stat.HP] = 7,
            _d[Stat_1.Stat.STR] = 1,
            _d[Stat_1.Stat.DEX] = 1,
            _d[Stat_1.Stat.INT] = 1,
            _d[Stat_1.Stat.CON] = 1,
            _d[Stat_1.Stat.AGI] = 1,
            _d[Stat_1.Stat.LUK] = 1,
            _d[Stat_1.Stat.SPECIAL] = 0,
            _d[Stat_1.Stat.XP] = 0.5,
            _d[Stat_1.Stat.GOLD] = 0,
            _d);
        return _this;
    }
    Generalist.prototype.oocAbility = function (player) {
        var luk = player.getStat(Stat_1.Stat.LUK);
        var xpGained = Math.max(player.gainXP(luk), 10);
        this.emitProfessionMessage(player, "You gained " + xpGained.toLocaleString() + " XP via Generalize!");
        return "You gained " + xpGained.toLocaleString() + " XP!";
    };
    return Generalist;
}(Profession_1.BaseProfession));
exports.Generalist = Generalist;
//# sourceMappingURL=Generalist.js.map