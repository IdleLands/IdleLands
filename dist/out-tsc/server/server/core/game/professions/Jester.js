"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var good_messages_1 = require("../../static/good-messages");
var Jester = /** @class */ (function (_super) {
    tslib_1.__extends(Jester, _super);
    function Jester() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Jest';
        _this.oocAbilityDesc = 'Surely you jest.';
        _this.oocAbilityCost = 1;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.LUK] = 5,
                _b),
            _a[Stat_1.Stat.STR] = (_c = {},
                _c[Stat_1.Stat.LUK] = 1,
                _c),
            _a[Stat_1.Stat.DEX] = (_d = {},
                _d[Stat_1.Stat.LUK] = 1,
                _d),
            _a[Stat_1.Stat.INT] = (_e = {},
                _e[Stat_1.Stat.LUK] = 1,
                _e),
            _a[Stat_1.Stat.CON] = (_f = {},
                _f[Stat_1.Stat.LUK] = 1,
                _f),
            _a[Stat_1.Stat.AGI] = (_g = {},
                _g[Stat_1.Stat.LUK] = 1,
                _g),
            _a[Stat_1.Stat.GOLD] = (_h = {},
                _h[Stat_1.Stat.LUK] = 0.01,
                _h),
            _a[Stat_1.Stat.XP] = (_j = {},
                _j[Stat_1.Stat.LUK] = 0.01,
                _j),
            _a);
        _this.statMultipliers = (_k = {},
            _k[Stat_1.Stat.HP] = 1,
            _k[Stat_1.Stat.STR] = 1,
            _k[Stat_1.Stat.DEX] = 1,
            _k[Stat_1.Stat.INT] = 1,
            _k[Stat_1.Stat.CON] = 1,
            _k[Stat_1.Stat.AGI] = 1,
            _k[Stat_1.Stat.LUK] = 1,
            _k[Stat_1.Stat.SPECIAL] = 0,
            _k[Stat_1.Stat.XP] = 1,
            _k[Stat_1.Stat.GOLD] = 1,
            _k);
        _this.statsPerLevel = (_l = {},
            _l[Stat_1.Stat.HP] = 0,
            _l[Stat_1.Stat.STR] = 0,
            _l[Stat_1.Stat.DEX] = 0,
            _l[Stat_1.Stat.INT] = 0,
            _l[Stat_1.Stat.CON] = 0,
            _l[Stat_1.Stat.AGI] = 0,
            _l[Stat_1.Stat.LUK] = 5,
            _l[Stat_1.Stat.SPECIAL] = 0,
            _l[Stat_1.Stat.XP] = 0.9,
            _l[Stat_1.Stat.GOLD] = 0.3,
            _l);
        return _this;
    }
    Jester.prototype.oocAbility = function (player) {
        var msg = lodash_1.sample(good_messages_1.GoodMessages);
        this.emitProfessionMessage(player, msg + "...");
        return msg + "...";
    };
    return Jester;
}(Profession_1.BaseProfession));
exports.Jester = Jester;
//# sourceMappingURL=Jester.js.map