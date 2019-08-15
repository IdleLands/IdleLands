"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var Cleric = /** @class */ (function (_super) {
    tslib_1.__extends(Cleric, _super);
    function Cleric() {
        var _a, _b, _c, _d, _e;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.specialStatName = 'Mana';
        _this.oocAbilityName = 'Cure Injury';
        _this.oocAbilityDesc = 'Cure an injury from each of your party members.';
        _this.oocAbilityCost = 20;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 3,
                _b),
            _a[Stat_1.Stat.SPECIAL] = (_c = {},
                _c[Stat_1.Stat.INT] = 7,
                _c),
            _a);
        _this.statMultipliers = (_d = {},
            _d[Stat_1.Stat.HP] = 1.6,
            _d[Stat_1.Stat.STR] = 0.9,
            _d[Stat_1.Stat.DEX] = 0.6,
            _d[Stat_1.Stat.INT] = 1.7,
            _d[Stat_1.Stat.CON] = 1.2,
            _d[Stat_1.Stat.AGI] = 0.4,
            _d[Stat_1.Stat.LUK] = 0.7,
            _d[Stat_1.Stat.SPECIAL] = 1,
            _d[Stat_1.Stat.XP] = 1,
            _d[Stat_1.Stat.GOLD] = 1,
            _d);
        _this.statsPerLevel = (_e = {},
            _e[Stat_1.Stat.HP] = 5,
            _e[Stat_1.Stat.STR] = 1.2,
            _e[Stat_1.Stat.DEX] = 1.3,
            _e[Stat_1.Stat.INT] = 1.5,
            _e[Stat_1.Stat.CON] = 1.6,
            _e[Stat_1.Stat.AGI] = 1,
            _e[Stat_1.Stat.LUK] = 1,
            _e[Stat_1.Stat.SPECIAL] = 1,
            _e[Stat_1.Stat.XP] = 0.3,
            _e[Stat_1.Stat.GOLD] = 0,
            _e);
        return _this;
    }
    Cleric.prototype.oocAbility = function (player) {
        player.giveCure();
        this.emitProfessionMessage(player, "You cured the wounds of yourself and your allies!");
        return 'You cured the wounds of yourself and your allies!';
    };
    return Cleric;
}(Profession_1.BaseProfession));
exports.Cleric = Cleric;
//# sourceMappingURL=Cleric.js.map