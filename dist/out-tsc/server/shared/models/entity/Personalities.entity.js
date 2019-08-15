"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var PlayerOwned_1 = require("./PlayerOwned");
var Personalities = /** @class */ (function (_super) {
    tslib_1.__extends(Personalities, _super);
    function Personalities() {
        var _this = _super.call(this) || this;
        if (!_this.personalities)
            _this.personalities = {};
        if (!_this.activePersonalities)
            _this.activePersonalities = {};
        return _this;
    }
    Object.defineProperty(Personalities.prototype, "$personalitiesData", {
        get: function () {
            return { personalities: this.personalities, activePersonalities: this.activePersonalities };
        },
        enumerable: true,
        configurable: true
    });
    Personalities.prototype.allEarnedPersonalities = function () {
        return Object.keys(this.personalities);
    };
    Personalities.prototype.has = function (personality) {
        return !!this.personalities[personality];
    };
    Personalities.prototype.isActive = function (personality) {
        return this.personalities[personality] && this.activePersonalities[personality];
    };
    Personalities.prototype.toggle = function (personality) {
        var _this = this;
        var name = personality.name;
        if (!this.personalities[name])
            return;
        this.activePersonalities[name] = !this.activePersonalities[name];
        var toggleOff = personality.toggleOff;
        if (this.activePersonalities[name] && toggleOff) {
            toggleOff.forEach(function (pers) { return _this.activePersonalities[pers] = false; });
        }
    };
    Personalities.prototype.add = function (personality) {
        this.personalities[personality.name] = personality.description;
    };
    Personalities.prototype.resetPersonalitiesTo = function (personalities) {
        var _this = this;
        this.personalities = {};
        personalities.forEach(function (pers) { return _this.add(pers); });
    };
    tslib_1.__decorate([
        typeorm_1.ObjectIdColumn(),
        tslib_1.__metadata("design:type", String)
    ], Personalities.prototype, "_id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Personalities.prototype, "personalities", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Personalities.prototype, "activePersonalities", void 0);
    Personalities = tslib_1.__decorate([
        typeorm_1.Entity(),
        tslib_1.__metadata("design:paramtypes", [])
    ], Personalities);
    return Personalities;
}(PlayerOwned_1.PlayerOwned));
exports.Personalities = Personalities;
//# sourceMappingURL=Personalities.entity.js.map