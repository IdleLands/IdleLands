"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var Festivals = /** @class */ (function () {
    function Festivals() {
    }
    Festivals.prototype.init = function () {
        if (!this.festivals)
            this.festivals = [];
    };
    Festivals.prototype.addFestival = function (festival) {
        this.festivals.push(festival);
    };
    Festivals.prototype.removeFestival = function (festivalId) {
        this.festivals = this.festivals.filter(function (x) { return x.id !== festivalId; });
    };
    tslib_1.__decorate([
        typeorm_1.ObjectIdColumn(),
        tslib_1.__metadata("design:type", String)
    ], Festivals.prototype, "_id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Array)
    ], Festivals.prototype, "festivals", void 0);
    Festivals = tslib_1.__decorate([
        typeorm_1.Entity()
    ], Festivals);
    return Festivals;
}());
exports.Festivals = Festivals;
//# sourceMappingURL=Festivals.entity.js.map