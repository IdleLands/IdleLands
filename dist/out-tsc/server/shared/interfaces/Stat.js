"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var Stat;
(function (Stat) {
    Stat["STR"] = "str";
    Stat["DEX"] = "dex";
    Stat["INT"] = "int";
    Stat["CON"] = "con";
    Stat["AGI"] = "agi";
    Stat["LUK"] = "luk";
    Stat["HP"] = "hp";
    Stat["SPECIAL"] = "special";
    Stat["XP"] = "xp";
    Stat["GOLD"] = "gold";
})(Stat = exports.Stat || (exports.Stat = {}));
exports.StatPartners = (_a = {},
    _a[Stat.STR] = Stat.INT,
    _a[Stat.INT] = Stat.STR,
    _a[Stat.DEX] = Stat.AGI,
    _a[Stat.AGI] = Stat.DEX,
    _a[Stat.CON] = Stat.LUK,
    _a[Stat.LUK] = Stat.CON,
    _a[Stat.HP] = Stat.HP,
    _a[Stat.XP] = Stat.GOLD,
    _a[Stat.GOLD] = Stat.XP,
    _a);
exports.AllStats = Object.keys(Stat).map(function (stat) { return Stat[stat]; });
exports.AllStatsButSpecial = exports.AllStats.filter(function (x) { return x !== Stat.SPECIAL; });
//# sourceMappingURL=Stat.js.map