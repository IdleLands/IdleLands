"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatEffect = function (miscEffect) {
    return function (skill, caster, combat) {
        miscEffect(combat, caster);
        return skill;
    };
};
//# sourceMappingURL=CombatEffect.js.map