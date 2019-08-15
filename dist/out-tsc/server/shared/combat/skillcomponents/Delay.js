"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delay = function (delay) {
    return function (skill, caster, combat) {
        if (!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
            throw new Error("Skill " + JSON.stringify(skill) + " is trying to Delay but has no targets. Combat: " + JSON.stringify(combat));
        }
        Object.keys(skill.targetEffects).forEach(function (characterId) {
            skill.targetEffects[characterId].forEach(function (effect) {
                effect.turnsUntilEffect = delay;
                if (delay instanceof Function) {
                    effect.turnsUntilEffect = delay(caster, combat.characters[characterId], combat);
                }
            });
        });
        return skill;
    };
};
//# sourceMappingURL=Delay.js.map