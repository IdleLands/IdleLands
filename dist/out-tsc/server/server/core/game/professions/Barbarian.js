"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var interfaces_1 = require("../../../../shared/interfaces");
var Barbarian = /** @class */ (function (_super) {
    tslib_1.__extends(Barbarian, _super);
    function Barbarian() {
        var _a, _b, _c, _d;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.specialStatName = 'Rage';
        _this.oocAbilityName = 'Duel';
        _this.oocAbilityDesc = 'Begin a duel with a random player.';
        _this.oocAbilityCost = 30;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 10,
                _b[Stat_1.Stat.STR] = 5,
                _b[Stat_1.Stat.INT] = -2,
                _b),
            _a);
        _this.statMultipliers = (_c = {},
            _c[Stat_1.Stat.HP] = 1,
            _c[Stat_1.Stat.STR] = 3,
            _c[Stat_1.Stat.DEX] = 1,
            _c[Stat_1.Stat.INT] = 0,
            _c[Stat_1.Stat.CON] = 3,
            _c[Stat_1.Stat.AGI] = 0.1,
            _c[Stat_1.Stat.LUK] = 0.1,
            _c[Stat_1.Stat.SPECIAL] = 0,
            _c[Stat_1.Stat.XP] = 1,
            _c[Stat_1.Stat.GOLD] = 1,
            _c);
        _this.statsPerLevel = (_d = {},
            _d[Stat_1.Stat.HP] = 35,
            _d[Stat_1.Stat.STR] = 5,
            _d[Stat_1.Stat.DEX] = 1,
            _d[Stat_1.Stat.INT] = 0,
            _d[Stat_1.Stat.CON] = 3,
            _d[Stat_1.Stat.AGI] = 0,
            _d[Stat_1.Stat.LUK] = 1,
            _d[Stat_1.Stat.SPECIAL] = 0,
            _d[Stat_1.Stat.XP] = 0.1,
            _d[Stat_1.Stat.GOLD] = 0,
            _d);
        return _this;
    }
    Barbarian.prototype.oocAbility = function (player) {
        player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.BattlePvP);
        this.emitProfessionMessage(player, "You seek out a worthy opponent!");
        return "You seek out a worthy opponent!";
    };
    Barbarian.prototype.determineStartingSpecial = function () {
        return 0;
    };
    Barbarian.prototype.determineMaxSpecial = function () {
        return 100;
    };
    return Barbarian;
}(Profession_1.BaseProfession));
exports.Barbarian = Barbarian;
//# sourceMappingURL=Barbarian.js.map