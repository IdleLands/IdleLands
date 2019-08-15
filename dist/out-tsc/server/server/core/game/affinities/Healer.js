"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("../professions/Profession");
var interfaces_1 = require("../../../../shared/interfaces");
var Healer = /** @class */ (function (_super) {
    tslib_1.__extends(Healer, _super);
    function Healer() {
        var _a, _b, _c, _d, _e;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.specialStatName = 'Mana';
        _this.statForStats = (_a = {},
            _a[interfaces_1.Stat.HP] = (_b = {},
                _b[interfaces_1.Stat.CON] = 3,
                _b),
            _a[interfaces_1.Stat.SPECIAL] = (_c = {},
                _c[interfaces_1.Stat.INT] = 10,
                _c),
            _a);
        _this.statMultipliers = (_d = {},
            _d[interfaces_1.Stat.HP] = 1,
            _d[interfaces_1.Stat.STR] = 0.5,
            _d[interfaces_1.Stat.DEX] = 1,
            _d[interfaces_1.Stat.INT] = 2.5,
            _d[interfaces_1.Stat.CON] = 1.3,
            _d[interfaces_1.Stat.AGI] = 2,
            _d[interfaces_1.Stat.LUK] = 2,
            _d[interfaces_1.Stat.SPECIAL] = 1,
            _d[interfaces_1.Stat.XP] = 1,
            _d[interfaces_1.Stat.GOLD] = 1,
            _d);
        _this.statsPerLevel = (_e = {},
            _e[interfaces_1.Stat.HP] = 4,
            _e[interfaces_1.Stat.STR] = 1,
            _e[interfaces_1.Stat.DEX] = 1,
            _e[interfaces_1.Stat.INT] = 3,
            _e[interfaces_1.Stat.CON] = 2,
            _e[interfaces_1.Stat.AGI] = 1,
            _e[interfaces_1.Stat.LUK] = 1,
            _e[interfaces_1.Stat.SPECIAL] = 20,
            _e[interfaces_1.Stat.XP] = 0,
            _e[interfaces_1.Stat.GOLD] = 0,
            _e);
        return _this;
    }
    return Healer;
}(Profession_1.BaseAffinity));
exports.Healer = Healer;
//# sourceMappingURL=Healer.js.map