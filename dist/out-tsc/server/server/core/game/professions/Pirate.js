"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("./Profession");
var Stat_1 = require("../../../../shared/interfaces/Stat");
var interfaces_1 = require("../../../../shared/interfaces");
var Pirate = /** @class */ (function (_super) {
    tslib_1.__extends(Pirate, _super);
    function Pirate() {
        var _a, _b, _c, _d;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.specialStatName = 'Bottle';
        _this.oocAbilityName = 'Pillage';
        _this.oocAbilityDesc = 'Acquire a random item.';
        _this.oocAbilityCost = 50;
        _this.statForStats = (_a = {},
            _a[Stat_1.Stat.HP] = (_b = {},
                _b[Stat_1.Stat.CON] = 5,
                _b),
            _a);
        _this.statMultipliers = (_c = {},
            _c[Stat_1.Stat.HP] = 2,
            _c[Stat_1.Stat.STR] = 3,
            _c[Stat_1.Stat.DEX] = 2,
            _c[Stat_1.Stat.INT] = 0.1,
            _c[Stat_1.Stat.CON] = 1.5,
            _c[Stat_1.Stat.AGI] = 0.8,
            _c[Stat_1.Stat.LUK] = 0.5,
            _c[Stat_1.Stat.SPECIAL] = 0,
            _c[Stat_1.Stat.XP] = 1,
            _c[Stat_1.Stat.GOLD] = 1,
            _c);
        _this.statsPerLevel = (_d = {},
            _d[Stat_1.Stat.HP] = 10,
            _d[Stat_1.Stat.STR] = 3,
            _d[Stat_1.Stat.DEX] = 2,
            _d[Stat_1.Stat.INT] = 0,
            _d[Stat_1.Stat.CON] = 2,
            _d[Stat_1.Stat.AGI] = 1,
            _d[Stat_1.Stat.LUK] = 0,
            _d[Stat_1.Stat.SPECIAL] = 1,
            _d[Stat_1.Stat.XP] = 0.4,
            _d[Stat_1.Stat.GOLD] = 1,
            _d);
        return _this;
    }
    Pirate.prototype.oocAbility = function (player) {
        var foundItem = player.$$game.itemGenerator.generateItemForPlayer(player, {
            generateLevel: player.level.total + Math.log(player.getStat(Stat_1.Stat.LUK)),
            qualityBoost: 1
        });
        player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.FindItem, { fromPillage: true, item: foundItem });
        this.emitProfessionMessage(player, "You pillaged an item (" + foundItem.name + ")!");
        return "You've pillaged an item (" + foundItem.name + ")!";
    };
    return Pirate;
}(Profession_1.BaseProfession));
exports.Pirate = Pirate;
//# sourceMappingURL=Pirate.js.map