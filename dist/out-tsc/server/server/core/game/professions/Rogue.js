"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var interfaces_1 = require("../../../../shared/interfaces");
var Rogue = /** @class */ (function (_super) {
    tslib_1.__extends(Rogue, _super);
    function Rogue() {
        var _a, _b, _c, _d;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.specialStatName = 'Energy';
        _this.oocAbilityName = '"Good Luck"';
        _this.oocAbilityDesc = 'Create a positively golden windfall for yourself.';
        _this.oocAbilityCost = 40;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 2,
                _b),
            _a);
        _this.statMultipliers = (_c = {},
            _c[Stat_1.Stat.HP] = 2,
            _c[Stat_1.Stat.STR] = 1.5,
            _c[Stat_1.Stat.DEX] = 3,
            _c[Stat_1.Stat.INT] = 0.8,
            _c[Stat_1.Stat.CON] = 0.8,
            _c[Stat_1.Stat.AGI] = 3,
            _c[Stat_1.Stat.LUK] = 1,
            _c[Stat_1.Stat.SPECIAL] = 0,
            _c[Stat_1.Stat.XP] = 1,
            _c[Stat_1.Stat.GOLD] = 1,
            _c);
        _this.statsPerLevel = (_d = {},
            _d[Stat_1.Stat.HP] = 15,
            _d[Stat_1.Stat.STR] = 2,
            _d[Stat_1.Stat.DEX] = 2,
            _d[Stat_1.Stat.INT] = 1,
            _d[Stat_1.Stat.CON] = 0,
            _d[Stat_1.Stat.AGI] = 2,
            _d[Stat_1.Stat.LUK] = 1,
            _d[Stat_1.Stat.SPECIAL] = 0,
            _d[Stat_1.Stat.XP] = 0.3,
            _d[Stat_1.Stat.GOLD] = 1.2,
            _d);
        return _this;
    }
    Rogue.prototype.oocAbility = function (player) {
        player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.BlessGold);
        player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.Gamble);
        player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.Merchant);
        this.emitProfessionMessage(player, 'You took a trip to the golden city!');
        return "You took a trip to the golden city!";
    };
    Rogue.prototype.determineStartingSpecial = function () {
        return 100;
    };
    Rogue.prototype.determineMaxSpecial = function () {
        return 100;
    };
    return Rogue;
}(Profession_1.BaseProfession));
exports.Rogue = Rogue;
//# sourceMappingURL=Rogue.js.map