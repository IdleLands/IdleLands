"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var AllProfessions = require("./professions");
var ProfessionHelper = /** @class */ (function () {
    function ProfessionHelper() {
    }
    ProfessionHelper.prototype.getProfession = function (prof) {
        return new AllProfessions[prof]();
    };
    ProfessionHelper.prototype.hasProfession = function (prof) {
        return AllProfessions[prof];
    };
    ProfessionHelper = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], ProfessionHelper);
    return ProfessionHelper;
}());
exports.ProfessionHelper = ProfessionHelper;
//# sourceMappingURL=profession-helper.js.map