"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Description = function (desc) { return function (skill, caster, combat) {
    if (!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
        throw new Error("Skill " + JSON.stringify(skill) + " is trying to Description but has no targets. Combat: " + JSON.stringify(combat));
    }
    Object.keys(skill.targetEffects).forEach(function (characterId) {
        skill.targetEffects[characterId].forEach(function (effect) {
            effect.desc = desc;
        });
    });
    return skill;
}; };
//# sourceMappingURL=Description.js.map