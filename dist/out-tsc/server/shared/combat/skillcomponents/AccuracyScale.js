"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccuracyScale = function (scaleMod) {
    return function (skill, caster, combat) {
        if (!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
            throw new Error("Skill " + JSON.stringify(skill) + " is trying to AccuracyScale but has no targets. Combat: " + JSON.stringify(combat));
        }
        Object.keys(skill.targetEffects).forEach(function (characterId) {
            skill.targetEffects[characterId].forEach(function (effect) {
                if (scaleMod instanceof Function) {
                    effect.accuracy = scaleMod(caster, combat.characters[characterId], combat);
                }
                else {
                    effect.accuracy = Math.floor(effect.accuracy * scaleMod);
                }
            });
        });
        return skill;
    };
};
//# sourceMappingURL=AccuracyScale.js.map