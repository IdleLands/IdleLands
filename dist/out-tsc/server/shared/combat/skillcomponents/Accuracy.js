"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var interfaces_1 = require("../../interfaces");
var AttackAccuracy;
(function (AttackAccuracy) {
    AttackAccuracy["STR"] = "str";
    AttackAccuracy["INT"] = "int";
})(AttackAccuracy = exports.AttackAccuracy || (exports.AttackAccuracy = {}));
var AttackAccuracyFunctions = (_a = {},
    _a[AttackAccuracy.STR] = function (caster, target) { return caster.stats[interfaces_1.Stat.STR] / target.stats[interfaces_1.Stat.AGI] * 100; },
    _a[AttackAccuracy.INT] = function (caster, target) { return caster.stats[interfaces_1.Stat.INT] / target.stats[interfaces_1.Stat.CON] * 100; },
    _a);
exports.Accuracy = function (accuracy) {
    return function (skill, caster, combat) {
        if (!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
            throw new Error("Skill " + JSON.stringify(skill) + " is trying to Delay but has no targets. Combat: " + JSON.stringify(combat));
        }
        Object.keys(skill.targetEffects).forEach(function (characterId) {
            skill.targetEffects[characterId].forEach(function (effect) {
                var totalAccuracy = accuracy;
                if (AttackAccuracyFunctions[accuracy]) {
                    totalAccuracy = AttackAccuracyFunctions[accuracy](caster, combat.characters[characterId], combat);
                }
                effect.accuracy = totalAccuracy;
            });
        });
        return skill;
    };
};
//# sourceMappingURL=Accuracy.js.map