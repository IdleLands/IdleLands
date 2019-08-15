"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var Rollbar = require("rollbar");
var rollbarToken = process.env.ROLLBAR_ACCESS_TOKEN;
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (rollbarToken) {
                    this.rollbar = new Rollbar({
                        accessToken: rollbarToken,
                        captureUncaught: true,
                        captureUnhandledRejections: true
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    Logger.prototype.timestamp = function () {
        return new Date();
    };
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, [this.timestamp()].concat(args));
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        console.error.apply(console, [this.timestamp()].concat(args));
        if (this.rollbar) {
            (_a = this.rollbar).error.apply(_a, args);
        }
    };
    Logger = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], Logger);
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map