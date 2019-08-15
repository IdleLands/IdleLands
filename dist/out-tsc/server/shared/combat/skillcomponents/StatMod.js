"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatMod = function (stat, statMod) {
    return function (skill, caster, combat) {
        if (!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
            throw new Error("Skill " + JSON.stringify(skill) + " is trying to StatMod but has no targets. Combat: " + JSON.stringify(combat));
        }
        Object.keys(skill.targetEffects).forEach(function (characterId) {
            skill.targetEffects[characterId].forEach(function (effect) {
                if (effect.modifyStat)
                    return;
                effect.modifyStat = stat;
                effect.modifyStatValue = statMod;
                if (statMod instanceof Function) {
                    effect.modifyStatValue = statMod(caster, combat.characters[characterId], combat);
                }
            });
        });
        return skill;
    };
};
//# sourceMappingURL=StatMod.js.map