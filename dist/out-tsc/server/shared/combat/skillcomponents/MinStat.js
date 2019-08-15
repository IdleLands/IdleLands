"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinStat = function (stat, statMod) {
    return function (skill, caster, combat) {
        if (!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
            throw new Error("Skill " + JSON.stringify(skill) + " is trying to MinStat but has no targets. Combat: " + JSON.stringify(combat));
        }
        Object.keys(skill.targetEffects).forEach(function (characterId) {
            skill.targetEffects[characterId].forEach(function (effect) {
                if (effect.modifyStat !== stat)
                    return;
                var compareValue = statMod;
                if (statMod instanceof Function) {
                    compareValue = statMod(caster, combat.characters[characterId], combat);
                }
                effect.modifyStatValue = Math.min(compareValue, effect.modifyStatValue);
            });
        });
        return skill;
    };
};
//# sourceMappingURL=MinStat.js.map