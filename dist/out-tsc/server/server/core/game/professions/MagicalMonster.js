"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var interfaces_1 = require("../../../../shared/interfaces");
var MagicalMonster = /** @class */ (function (_super) {
    tslib_1.__extends(MagicalMonster, _super);
    function MagicalMonster() {
        var _a, _b, _c, _d;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Tempt Fate';
        _this.oocAbilityDesc = 'Sing a fateful song, and find out what happens next!';
        _this.oocAbilityCost = 50;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 10,
                _b),
            _a);
        _this.statMultipliers = (_c = {},
            _c[Stat_1.Stat.HP] = 0.8,
            _c[Stat_1.Stat.STR] = 0.5,
            _c[Stat_1.Stat.DEX] = 0.5,
            _c[Stat_1.Stat.INT] = 3,
            _c[Stat_1.Stat.CON] = 0.7,
            _c[Stat_1.Stat.AGI] = 3,
            _c[Stat_1.Stat.LUK] = 5,
            _c[Stat_1.Stat.SPECIAL] = 0,
            _c[Stat_1.Stat.XP] = 2,
            _c[Stat_1.Stat.GOLD] = 1,
            _c);
        _this.statsPerLevel = (_d = {},
            _d[Stat_1.Stat.HP] = 10,
            _d[Stat_1.Stat.STR] = 1,
            _d[Stat_1.Stat.DEX] = 1,
            _d[Stat_1.Stat.INT] = 5,
            _d[Stat_1.Stat.CON] = 1,
            _d[Stat_1.Stat.AGI] = 5,
            _d[Stat_1.Stat.LUK] = 2,
            _d[Stat_1.Stat.SPECIAL] = 0,
            _d[Stat_1.Stat.XP] = 0.5,
            _d[Stat_1.Stat.GOLD] = 0.1,
            _d);
        return _this;
    }
    MagicalMonster.prototype.oocAbility = function (player) {
        player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.Providence);
        this.emitProfessionMessage(player, 'You tempted fate!');
        return "You've tempted fate! Your adventure log has the details.";
    };
    return MagicalMonster;
}(Profession_1.BaseProfession));
exports.MagicalMonster = MagicalMonster;
//# sourceMappingURL=MagicalMonster.js.map