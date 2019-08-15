"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayScale = function (scaleMod) {
    return function (skill, caster, combat) {
        if (!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
            throw new Error("Skill " + JSON.stringify(skill) + " is trying to DelayScale but has no targets. Combat: " + JSON.stringify(combat));
        }
        Object.keys(skill.targetEffects).forEach(function (characterId) {
            skill.targetEffects[characterId].forEach(function (effect) {
                if (scaleMod instanceof Function) {
                    effect.turnsUntilEffect = scaleMod(caster, combat.characters[characterId], combat);
                }
                else {
                    effect.turnsUntilEffect = Math.floor(effect.turnsUntilEffect * scaleMod);
                }
            });
        });
        return skill;
    };
};
//# sourceMappingURL=DelayScale.js.map