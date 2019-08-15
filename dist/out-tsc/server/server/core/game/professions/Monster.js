"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var interfaces_1 = require("../../../../shared/interfaces");
var Monster = /** @class */ (function (_super) {
    tslib_1.__extends(Monster, _super);
    function Monster() {
        var _a, _b, _c, _d;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Swap Fiend';
        _this.oocAbilityDesc = 'Perform two switcheroos on yourself.';
        _this.oocAbilityCost = 30;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 20,
                _b),
            _a);
        _this.statMultipliers = (_c = {},
            _c[Stat_1.Stat.HP] = 5,
            _c[Stat_1.Stat.STR] = 1.5,
            _c[Stat_1.Stat.DEX] = 1,
            _c[Stat_1.Stat.INT] = 0.5,
            _c[Stat_1.Stat.CON] = 3,
            _c[Stat_1.Stat.AGI] = 1.5,
            _c[Stat_1.Stat.LUK] = 0,
            _c[Stat_1.Stat.SPECIAL] = 0,
            _c[Stat_1.Stat.XP] = 0,
            _c[Stat_1.Stat.GOLD] = 0,
            _c);
        _this.statsPerLevel = (_d = {},
            _d[Stat_1.Stat.HP] = 10,
            _d[Stat_1.Stat.STR] = 2,
            _d[Stat_1.Stat.DEX] = 1,
            _d[Stat_1.Stat.INT] = 0,
            _d[Stat_1.Stat.CON] = 2,
            _d[Stat_1.Stat.AGI] = 0,
            _d[Stat_1.Stat.LUK] = 0,
            _d[Stat_1.Stat.SPECIAL] = 0,
            _d[Stat_1.Stat.XP] = 0.4,
            _d[Stat_1.Stat.GOLD] = 0.2,
            _d);
        return _this;
    }
    Monster.prototype.oocAbility = function (player) {
        player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.Switcheroo);
        player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.Switcheroo);
        this.emitProfessionMessage(player, 'You switched yourself around a bit!');
        return "You've switched yourself around a bit!";
    };
    return Monster;
}(Profession_1.BaseProfession));
exports.Monster = Monster;
//# sourceMappingURL=Monster.js.map