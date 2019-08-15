"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomNumber = function (minEval, maxEval, isPositive) {
    return function (caster, target, combat) {
        var min = minEval;
        if (minEval instanceof Function) {
            min = minEval(caster, target, combat);
        }
        var max = maxEval;
        if (maxEval instanceof Function) {
            max = maxEval(caster, target, combat);
        }
        if (max < min)
            max = min;
        return Math.floor(combat.chance.integer({ min: min, max: max })) * (isPositive ? 1 : -1);
    };
};
//# sourceMappingURL=RandomNumber.js.map