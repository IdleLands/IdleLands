"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var CalculatorHelper = /** @class */ (function () {
    function CalculatorHelper() {
    }
    CalculatorHelper.prototype.calcLevelMaxXP = function (level) {
        return Math.floor(100 + (50 * Math.pow(level, 1.65)));
    };
    CalculatorHelper = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], CalculatorHelper);
    return CalculatorHelper;
}());
exports.CalculatorHelper = CalculatorHelper;
//# sourceMappingURL=calculator-helper.js.map