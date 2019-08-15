"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatScale = function (scaleMod) {
    return function (skill, caster, combat) {
        if (!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
            throw new Error("Skill " + JSON.stringify(skill) + " is trying to StatScale but has no targets. Combat: " + JSON.stringify(combat));
        }
        Object.keys(skill.targetEffects).forEach(function (characterId) {
            skill.targetEffects[characterId].forEach(function (effect) {
                if (scaleMod instanceof Function) {
                    effect.modifyStatValue = scaleMod(caster, combat.characters[characterId], combat);
                }
                else {
                    effect.modifyStatValue = Math.floor(effect.modifyStatValue * scaleMod);
                }
            });
        });
        return skill;
    };
};
//# sourceMappingURL=StatScale.js.map