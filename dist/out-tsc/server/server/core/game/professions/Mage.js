"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var Mage = /** @class */ (function (_super) {
    tslib_1.__extends(Mage, _super);
    function Mage() {
        var _a, _b, _c, _d, _e;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.specialStatName = 'Mana';
        _this.oocAbilityName = 'Alchemy';
        _this.oocAbilityDesc = 'Gain GOLD based on your INT.';
        _this.oocAbilityCost = 20;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 5,
                _b),
            _a[Stat_1.Stat.SPECIAL] = (_c = {},
                _c[Stat_1.Stat.INT] = 10,
                _c),
            _a);
        _this.statMultipliers = (_d = {},
            _d[Stat_1.Stat.HP] = 0.8,
            _d[Stat_1.Stat.STR] = 0.5,
            _d[Stat_1.Stat.DEX] = 0.5,
            _d[Stat_1.Stat.INT] = 2.3,
            _d[Stat_1.Stat.CON] = 1,
            _d[Stat_1.Stat.AGI] = 0.2,
            _d[Stat_1.Stat.LUK] = 0.8,
            _d[Stat_1.Stat.SPECIAL] = 1,
            _d[Stat_1.Stat.XP] = 1,
            _d[Stat_1.Stat.GOLD] = 1,
            _d);
        _this.statsPerLevel = (_e = {},
            _e[Stat_1.Stat.HP] = 5,
            _e[Stat_1.Stat.STR] = 1,
            _e[Stat_1.Stat.DEX] = 1,
            _e[Stat_1.Stat.INT] = 2,
            _e[Stat_1.Stat.CON] = 1,
            _e[Stat_1.Stat.AGI] = 1,
            _e[Stat_1.Stat.LUK] = 1,
            _e[Stat_1.Stat.SPECIAL] = 1,
            _e[Stat_1.Stat.XP] = 0.7,
            _e[Stat_1.Stat.GOLD] = 0.5,
            _e);
        return _this;
    }
    Mage.prototype.oocAbility = function (player) {
        var int = player.getStat(Stat_1.Stat.INT);
        var goldGained = Math.max(player.gainGold(int), 10);
        this.emitProfessionMessage(player, "You gained " + goldGained.toLocaleString() + " GOLD via Alchemy!");
        return "You gained " + goldGained.toLocaleString() + " GOLD!";
    };
    return Mage;
}(Profession_1.BaseProfession));
exports.Mage = Mage;
//# sourceMappingURL=Mage.js.map