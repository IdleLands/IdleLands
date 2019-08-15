"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chance_1 = require("chance");
var typescript_ioc_1 = require("typescript-ioc");
var RNGService = /** @class */ (function () {
    function RNGService() {
        // to seed this: https://github.com/chancejs/chancejs/issues/371
        this._chance = new chance_1.Chance();
    }
    Object.defineProperty(RNGService.prototype, "chance", {
        get: function () {
            return this._chance;
        },
        enumerable: true,
        configurable: true
    });
    RNGService.prototype.id = function () {
        return this.chance.guid();
    };
    RNGService.prototype.numberInRange = function (min, max) {
        return this.chance.integer(this.clampMinAtMax({ min: min, max: max }));
    };
    RNGService.prototype.clampMinAtMax = function (_a) {
        var min = _a.min, max = _a.max;
        if (min < max)
            return { min: min, max: max };
        return { min: max, max: max };
    };
    RNGService.prototype.pickone = function (items) {
        if (!items || items.length === 0)
            return null;
        return this.chance.pickone(items);
    };
    RNGService.prototype.picksome = function (items, qty) {
        if (items.length === 0)
            return null;
        return this.chance.pickset(items, qty);
    };
    RNGService.prototype.likelihood = function (percent) {
        if (percent === void 0) { percent = 50; }
        return this.chance.bool({ likelihood: percent });
    };
    RNGService.prototype.weighted = function (items, weights) {
        return this.chance.weighted(items, weights);
    };
    RNGService.prototype.weightedFromLootastic = function (items) {
        return this.weighted(items.map(function (x) { return x.result; }), items.map(function (x) { return x.chance; }));
    };
    RNGService = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], RNGService);
    return RNGService;
}());
exports.RNGService = RNGService;
//# sourceMappingURL=rng-service.js.map