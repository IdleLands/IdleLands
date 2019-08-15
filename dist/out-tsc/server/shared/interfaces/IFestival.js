"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b, _c, _d, _e;
var Stat_1 = require("./Stat");
var FestivalChannelOperation;
(function (FestivalChannelOperation) {
    // used when a festival is added
    FestivalChannelOperation[FestivalChannelOperation["Add"] = 0] = "Add";
    // used when a festival is removed
    FestivalChannelOperation[FestivalChannelOperation["Remove"] = 1] = "Remove";
})(FestivalChannelOperation = exports.FestivalChannelOperation || (exports.FestivalChannelOperation = {}));
var FestivalType;
(function (FestivalType) {
    FestivalType["XP"] = "XP";
    FestivalType["Gold"] = "Gold";
    FestivalType["CoreStats"] = "CoreStats";
})(FestivalType = exports.FestivalType || (exports.FestivalType = {}));
var FESTIVAL_STAT_MULT = 20;
exports.FestivalStats = (_a = {},
    _a[FestivalType.CoreStats] = (_b = {},
        _b[Stat_1.Stat.STR] = FESTIVAL_STAT_MULT,
        _b[Stat_1.Stat.AGI] = FESTIVAL_STAT_MULT,
        _b[Stat_1.Stat.CON] = FESTIVAL_STAT_MULT,
        _b[Stat_1.Stat.DEX] = FESTIVAL_STAT_MULT,
        _b[Stat_1.Stat.INT] = FESTIVAL_STAT_MULT,
        _b[Stat_1.Stat.LUK] = FESTIVAL_STAT_MULT,
        _b),
    _a[FestivalType.XP] = (_c = {}, _c[Stat_1.Stat.XP] = FESTIVAL_STAT_MULT, _c),
    _a[FestivalType.Gold] = (_d = {}, _d[Stat_1.Stat.GOLD] = FESTIVAL_STAT_MULT, _d),
    _a);
exports.FestivalCost = (_e = {},
    _e[FestivalType.CoreStats] = 25,
    _e[FestivalType.XP] = 35,
    _e[FestivalType.Gold] = 45,
    _e);
//# sourceMappingURL=IFestival.js.map