"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("../professions/Profession");
var interfaces_1 = require("../../../../shared/interfaces");
var None = /** @class */ (function (_super) {
    tslib_1.__extends(None, _super);
    function None() {
        var _a, _b, _c, _d;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.statForStats = (_a = {},
            _a[interfaces_1.Stat.HP] = (_b = {},
                _b[interfaces_1.Stat.CON] = 1,
                _b),
            _a);
        _this.statMultipliers = (_c = {},
            _c[interfaces_1.Stat.HP] = 1,
            _c[interfaces_1.Stat.STR] = 1,
            _c[interfaces_1.Stat.DEX] = 1,
            _c[interfaces_1.Stat.INT] = 1,
            _c[interfaces_1.Stat.CON] = 1,
            _c[interfaces_1.Stat.AGI] = 1,
            _c[interfaces_1.Stat.LUK] = 1,
            _c[interfaces_1.Stat.XP] = 1,
            _c[interfaces_1.Stat.GOLD] = 1,
            _c);
        _this.statsPerLevel = (_d = {},
            _d[interfaces_1.Stat.HP] = 1,
            _d[interfaces_1.Stat.STR] = 1,
            _d[interfaces_1.Stat.DEX] = 1,
            _d[interfaces_1.Stat.INT] = 1,
            _d[interfaces_1.Stat.CON] = 1,
            _d[interfaces_1.Stat.AGI] = 1,
            _d[interfaces_1.Stat.LUK] = 1,
            _d[interfaces_1.Stat.XP] = 0,
            _d[interfaces_1.Stat.GOLD] = 0,
            _d);
        return _this;
    }
    return None;
}(Profession_1.BaseAffinity));
exports.None = None;
//# sourceMappingURL=None.js.map