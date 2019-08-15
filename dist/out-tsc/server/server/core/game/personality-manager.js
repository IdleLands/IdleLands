"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var Personalities = require("./personalities");
var PersonalityManager = /** @class */ (function () {
    function PersonalityManager() {
    }
    PersonalityManager.prototype.get = function (name) {
        return Personalities[name];
    };
    PersonalityManager = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], PersonalityManager);
    return PersonalityManager;
}());
exports.PersonalityManager = PersonalityManager;
//# sourceMappingURL=personality-manager.js.map