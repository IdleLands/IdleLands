"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SameTarget = function () {
    var combinatorContainers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        combinatorContainers[_i] = arguments[_i];
    }
    return function (skill, caster, combat) {
        if (!skill.targets || skill.targets.length === 0) {
            throw new Error("Skill " + JSON.stringify(skill) + " is trying to SameTarget but has no targets. Combat: " + JSON.stringify(combat));
        }
        combinatorContainers.forEach(function (combinatorSkill) {
            var baseCombineSkill = { targets: skill.targets.filter(function (x) { return !isNaN(x); }) };
            var newSkill = combinatorSkill.reduce(function (prev, cur) {
                return cur(prev, caster, combat);
            }, baseCombineSkill);
            newSkill.targets.forEach(function (target) {
                if (isNaN(target))
                    return;
                newSkill.targetEffects[target].forEach(function (eff) {
                    skill.targetEffects = skill.targetEffects || {};
                    skill.targetEffects[target] = skill.targetEffects[target] || [];
                    skill.targetEffects[target].push(eff);
                });
            });
        });
        return skill;
    };
};
//# sourceMappingURL=SameTarget.js.map