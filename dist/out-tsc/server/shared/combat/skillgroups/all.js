"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var interfaces_1 = require("../../interfaces");
var skillcomponents_1 = require("../skillcomponents");
var RandomNumber_1 = require("../skillcomponents/RandomNumber");
/**
 * These abilities are basic building blocks that don't really need to be repeated.
 */
exports.Attack = function (min, max) {
    if (min === void 0) { min = 1; }
    if (max === void 0) { max = function (attacker) { return Math.floor(attacker.stats[interfaces_1.Stat.STR]); }; }
    return [
        skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy),
        skillcomponents_1.EffectsPerTarget(1),
        skillcomponents_1.Description('%source attacked %target for %value damage!'),
        skillcomponents_1.Accuracy(90),
        skillcomponents_1.StatMod(interfaces_1.Stat.HP, RandomNumber_1.RandomNumber(min, max))
    ];
};
exports.RegenerateHP = function (val) { return [
    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self),
    skillcomponents_1.EffectsPerTarget(1),
    skillcomponents_1.Description('%source regenerated %value health!'),
    skillcomponents_1.Accuracy(100),
    skillcomponents_1.StatMod(interfaces_1.Stat.HP, val)
]; };
exports.RegenerateSpecial = function (val, silent) {
    if (silent === void 0) { silent = false; }
    return [
        skillcomponents_1.Targets(skillcomponents_1.Targetting.Self),
        skillcomponents_1.EffectsPerTarget(1),
        skillcomponents_1.Description(silent ? '' : '%source regenerated %value %special!'),
        skillcomponents_1.Accuracy(100),
        skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, val)
    ];
};
exports.SummonCreature = function (statMuliplier) {
    if (statMuliplier === void 0) { statMuliplier = 1; }
    return function (combat, caster) {
        var stats = Object.assign({}, caster.stats);
        Object.keys(stats).forEach(function (stat) { return stats[stat] = Math.floor(stats[stat] * statMuliplier); });
        var maxStats = Object.assign({}, stats);
        var newCreature = {
            name: combat.chance.name() + " (" + caster.name + "'s Summon)",
            level: caster.level,
            stats: stats,
            maxStats: maxStats,
            combatId: lodash_1.max(Object.keys(combat.characters).map(function (x) { return +x; })) + 1,
            combatPartyId: caster.combatPartyId,
            summonerId: caster.combatId,
            affinity: combat.chance.pickone(Object.values(interfaces_1.PetAffinity))
        };
        combat.characters[newCreature.combatId] = newCreature;
    };
};
//# sourceMappingURL=all.js.map