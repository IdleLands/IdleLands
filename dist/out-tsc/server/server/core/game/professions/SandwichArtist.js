"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var SandwichArtist = /** @class */ (function (_super) {
    tslib_1.__extends(SandwichArtist, _super);
    function SandwichArtist() {
        var _a, _b, _c, _d;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Panhandle';
        _this.oocAbilityDesc = 'Give your party a GOLD buff based on your LUK for 720 ticks.';
        _this.oocAbilityCost = 20;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 10,
                _b),
            _a);
        _this.statMultipliers = (_c = {},
            _c[Stat_1.Stat.HP] = 1,
            _c[Stat_1.Stat.STR] = 1.5,
            _c[Stat_1.Stat.DEX] = 1.5,
            _c[Stat_1.Stat.INT] = 1.5,
            _c[Stat_1.Stat.CON] = 1.5,
            _c[Stat_1.Stat.AGI] = 1.5,
            _c[Stat_1.Stat.LUK] = 1,
            _c[Stat_1.Stat.SPECIAL] = 0,
            _c[Stat_1.Stat.XP] = 1,
            _c[Stat_1.Stat.GOLD] = 1,
            _c);
        _this.statsPerLevel = (_d = {},
            _d[Stat_1.Stat.HP] = 5,
            _d[Stat_1.Stat.STR] = 2,
            _d[Stat_1.Stat.DEX] = 2,
            _d[Stat_1.Stat.INT] = 2,
            _d[Stat_1.Stat.CON] = 2,
            _d[Stat_1.Stat.AGI] = 2,
            _d[Stat_1.Stat.LUK] = 2,
            _d[Stat_1.Stat.SPECIAL] = 0,
            _d[Stat_1.Stat.XP] = 0.1,
            _d[Stat_1.Stat.GOLD] = 0.7,
            _d);
        return _this;
    }
    SandwichArtist.prototype.oocAbility = function (player) {
        var _a;
        var luk = player.getStat(Stat_1.Stat.LUK);
        var numAbilUsesBonus = Math.floor(player.$statistics.get('Profession/SandwichArtist/AbilityUses') / 10);
        player.grantBuff({
            name: 'Panhandle',
            statistic: 'Character/Ticks',
            booster: true,
            duration: 720,
            stats: (_a = {},
                _a[Stat_1.Stat.GOLD] = (Math.log(luk) * Math.log(player.level.total)) + numAbilUsesBonus,
                _a)
        }, true);
        this.emitProfessionMessage(player, 'Your GOLD gain will be increased for 720 ticks!');
        return "Your GOLD gain will be increased for 720 ticks!";
    };
    return SandwichArtist;
}(Profession_1.BaseProfession));
exports.SandwichArtist = SandwichArtist;
//# sourceMappingURL=SandwichArtist.js.map