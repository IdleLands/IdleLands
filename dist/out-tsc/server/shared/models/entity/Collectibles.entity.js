"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var PlayerOwned_1 = require("./PlayerOwned");
var Collectibles = /** @class */ (function (_super) {
    tslib_1.__extends(Collectibles, _super);
    function Collectibles() {
        var _this = _super.call(this) || this;
        if (!_this.collectibles)
            _this.collectibles = {};
        return _this;
    }
    Object.defineProperty(Collectibles.prototype, "$collectiblesData", {
        get: function () {
            return { collectibles: this.collectibles };
        },
        enumerable: true,
        configurable: true
    });
    Collectibles.prototype.add = function (coll) {
        this.collectibles[coll.name] = coll;
    };
    Collectibles.prototype.has = function (collName) {
        return !!this.get(collName);
    };
    Collectibles.prototype.hasCurrently = function (collName) {
        var coll = this.get(collName);
        if (!coll)
            return false;
        return coll.foundAt !== 0;
    };
    Collectibles.prototype.get = function (collName) {
        return this.collectibles[collName];
    };
    Collectibles.prototype.resetFoundAts = function () {
        var _this = this;
        Object.keys(this.collectibles).forEach(function (collName) {
            var coll = _this.get(collName);
            coll.foundAt = 0;
        });
    };
    Collectibles.prototype.getFoundCollectibles = function () {
        return Object.keys(this.collectibles).length;
    };
    Collectibles.prototype.getUnfoundOwnedCollectibles = function () {
        return Object.values(this.collectibles).filter(function (coll) { return coll.foundAt === 0; });
    };
    Collectibles.prototype.getFoundOwnedCollectibles = function () {
        return Object.values(this.collectibles).filter(function (coll) { return coll.foundAt !== 0; });
    };
    Collectibles.prototype.refindCollectible = function (collectible) {
        this.collectibles[collectible].foundAt = Date.now();
    };
    tslib_1.__decorate([
        typeorm_1.ObjectIdColumn(),
        tslib_1.__metadata("design:type", String)
    ], Collectibles.prototype, "_id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Collectibles.prototype, "collectibles", void 0);
    Collectibles = tslib_1.__decorate([
        typeorm_1.Entity(),
        tslib_1.__metadata("design:paramtypes", [])
    ], Collectibles);
    return Collectibles;
}(PlayerOwned_1.PlayerOwned));
exports.Collectibles = Collectibles;
//# sourceMappingURL=Collectibles.entity.js.map