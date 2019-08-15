"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectsPerTarget = function (times) {
    return function (skill, caster, combat) {
        if (!skill.targets || skill.targets.length === 0) {
            throw new Error("Skill " + JSON.stringify(skill) + " is trying to EffectsPerTarget but has no targets. Combat: " + JSON.stringify(combat));
        }
        skill.targetEffects = skill.targetEffects || {};
        skill.targets.forEach(function (target) {
            skill.targetEffects[target] = skill.targetEffects[target] || [];
            for (var i = 0; i < times; i++) {
                skill.targetEffects[target].push({
                    accuracy: 100,
                    desc: '',
                    source: caster.combatId,
                    modifyStat: null,
                    modifyStatValue: 0,
                    turnsUntilEffect: 0,
                    turnsEffectLasts: 0
                });
            }
        });
        return skill;
    };
};
//# sourceMappingURL=EffectsPerTarget.js.map