"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var interfaces_1 = require("../../interfaces");
var Targetting;
(function (Targetting) {
    Targetting[Targetting["Self"] = 0] = "Self";
    Targetting[Targetting["InjuredSelf"] = 1] = "InjuredSelf";
    Targetting[Targetting["Anyone"] = 2] = "Anyone";
    Targetting[Targetting["SingleAlly"] = 3] = "SingleAlly";
    Targetting[Targetting["SingleEnemy"] = 4] = "SingleEnemy";
    Targetting[Targetting["InjuredAlly"] = 5] = "InjuredAlly";
    Targetting[Targetting["InjuredEnemy"] = 6] = "InjuredEnemy";
    Targetting[Targetting["DeadAlly"] = 7] = "DeadAlly";
    Targetting[Targetting["DeadEnemy"] = 8] = "DeadEnemy";
    Targetting[Targetting["AllAllies"] = 9] = "AllAllies";
    Targetting[Targetting["AllEnemies"] = 10] = "AllEnemies";
    Targetting[Targetting["All"] = 11] = "All";
    Targetting[Targetting["AllButSelf"] = 12] = "AllButSelf";
})(Targetting = exports.Targetting || (exports.Targetting = {}));
var Dead = function (char) { return char.stats[interfaces_1.Stat.HP] <= 0; };
var NotDead = function (char) { return char.stats[interfaces_1.Stat.HP] > 0; };
var Injured = function (char) { return char.stats[interfaces_1.Stat.HP] < char.maxStats[interfaces_1.Stat.HP]; };
var TargettingFunctions = (_a = {},
    _a[Targetting.Self] = function (caster, combat) { return [caster]; },
    _a[Targetting.InjuredSelf] = function (caster, combat) { return [caster].filter(Injured); },
    _a[Targetting.Anyone] = function (caster, combat) { return [combat.chance.pickone(Object.values(combat.characters)
            .filter(NotDead))]; },
    _a[Targetting.SingleEnemy] = function (caster, combat) { return [combat.chance.pickone(Object.values(combat.characters)
            .filter(function (x) { return x.combatPartyId !== caster.combatPartyId; })
            .filter(NotDead))]; },
    _a[Targetting.SingleAlly] = function (caster, combat) { return [combat.chance.pickone(Object.values(combat.characters)
            .filter(function (x) { return x.combatPartyId === caster.combatPartyId; })
            .filter(NotDead))]; },
    _a[Targetting.InjuredEnemy] = function (caster, combat) { return [combat.chance.pickone(Object.values(combat.characters)
            .filter(function (x) { return x.combatPartyId !== caster.combatPartyId; })
            .filter(Injured))]; },
    _a[Targetting.InjuredAlly] = function (caster, combat) { return [combat.chance.pickone(Object.values(combat.characters)
            .filter(function (x) { return x.combatPartyId === caster.combatPartyId; })
            .filter(Injured))]; },
    _a[Targetting.DeadEnemy] = function (caster, combat) { return [combat.chance.pickone(Object.values(combat.characters)
            .filter(function (x) { return x.combatPartyId !== caster.combatPartyId; })
            .filter(Dead))]; },
    _a[Targetting.DeadAlly] = function (caster, combat) { return [combat.chance.pickone(Object.values(combat.characters)
            .filter(function (x) { return x.combatPartyId === caster.combatPartyId; })
            .filter(Dead))]; },
    _a[Targetting.AllEnemies] = function (caster, combat) { return Object.values(combat.characters)
        .filter(function (x) { return x.combatPartyId !== caster.combatPartyId; })
        .filter(NotDead); },
    _a[Targetting.AllAllies] = function (caster, combat) { return Object.values(combat.characters)
        .filter(function (x) { return x.combatPartyId === caster.combatPartyId; })
        .filter(NotDead); },
    _a[Targetting.All] = function (caster, combat) { return Object.values(combat.characters)
        .filter(NotDead); },
    _a[Targetting.AllButSelf] = function (caster, combat) { return Object.values(combat.characters)
        .filter(function (x) { return x !== caster; })
        .filter(NotDead); },
    _a);
exports.NumberOfTargets = function (func, caster, combat) {
    try {
        return TargettingFunctions[func](caster, combat).length;
    }
    catch (e) {
        return 0;
    }
};
exports.Targets = function (targetFunc) {
    return function (skill, caster, combat) {
        try {
            skill.targets = TargettingFunctions[targetFunc](caster, combat).map(function (x) { return x.combatId; });
        }
        catch (e) {
            // will trigger isNaN (null is a number, apparently)
            skill.targets = [undefined];
        }
        return skill;
    };
};
//# sourceMappingURL=Targets.js.map