"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var mongodb_1 = require("mongodb");
var lodash_1 = require("lodash");
var PlayerOwned = /** @class */ (function () {
    function PlayerOwned() {
    }
    PlayerOwned.prototype.setOwner = function (owner) {
        this.owner = this.owner || owner.name;
        this._id = this._id || mongodb_1.ObjectID();
    };
    PlayerOwned.prototype.toSaveObject = function () {
        return lodash_1.pickBy(this, function (value, key) { return !key.startsWith('$'); });
    };
    var _a;
    tslib_1.__decorate([
        typeorm_1.ObjectIdColumn(),
        tslib_1.__metadata("design:type", typeof (_a = typeof mongodb_1.ObjectID !== "undefined" && mongodb_1.ObjectID) === "function" ? _a : Object)
    ], PlayerOwned.prototype, "_id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], PlayerOwned.prototype, "owner", void 0);
    return PlayerOwned;
}());
exports.PlayerOwned = PlayerOwned;
//# sourceMappingURL=PlayerOwned.js.map