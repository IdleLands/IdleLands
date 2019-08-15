"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var Bard = /** @class */ (function (_super) {
    tslib_1.__extends(Bard, _super);
    function Bard() {
        var _a, _b, _c, _d;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.specialStatName = 'Song';
        _this.oocAbilityName = 'Orchestra';
        _this.oocAbilityDesc = 'Start a random festival that lasts an hour.';
        _this.oocAbilityCost = 60;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 5,
                _b),
            _a);
        _this.statMultipliers = (_c = {},
            _c[Stat_1.Stat.HP] = 1.3,
            _c[Stat_1.Stat.STR] = 1,
            _c[Stat_1.Stat.DEX] = 3,
            _c[Stat_1.Stat.INT] = 2,
            _c[Stat_1.Stat.CON] = 1,
            _c[Stat_1.Stat.AGI] = 0.7,
            _c[Stat_1.Stat.LUK] = 0.8,
            _c[Stat_1.Stat.SPECIAL] = 0,
            _c[Stat_1.Stat.XP] = 1,
            _c[Stat_1.Stat.GOLD] = 1,
            _c);
        _this.statsPerLevel = (_d = {},
            _d[Stat_1.Stat.HP] = 25,
            _d[Stat_1.Stat.STR] = 1,
            _d[Stat_1.Stat.DEX] = 3,
            _d[Stat_1.Stat.INT] = 2,
            _d[Stat_1.Stat.CON] = 1,
            _d[Stat_1.Stat.AGI] = 1,
            _d[Stat_1.Stat.LUK] = 1,
            _d[Stat_1.Stat.SPECIAL] = 0,
            _d[Stat_1.Stat.XP] = 0.4,
            _d[Stat_1.Stat.GOLD] = 0.7,
            _d);
        return _this;
    }
    Bard.prototype.oocAbility = function (player) {
        var stats = {};
        Object.values(Stat_1.Stat).forEach(function (stat) {
            stats[stat] = player.$$game.rngService.numberInRange(-10, 10);
        });
        var festival = {
            name: player.name + "'s Bardic Festival",
            endTime: Date.now() + (1000 * 60 * 60),
            startedBy: player.name + " the Bard",
            stats: stats
        };
        player.$$game.festivalManager.startFestival(player, festival);
        this.emitProfessionMessage(player, "You sing the song of your people!");
        return "You sing the song of your people!";
    };
    Bard.prototype.determineStartingSpecial = function () {
        return 0;
    };
    Bard.prototype.determineMaxSpecial = function () {
        return 3;
    };
    return Bard;
}(Profession_1.BaseProfession));
exports.Bard = Bard;
//# sourceMappingURL=Bard.js.map