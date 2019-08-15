"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var GameSettings = /** @class */ (function () {
    function GameSettings() {
    }
    GameSettings.prototype.init = function () {
    };
    tslib_1.__decorate([
        typeorm_1.ObjectIdColumn(),
        tslib_1.__metadata("design:type", String)
    ], GameSettings.prototype, "_id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], GameSettings.prototype, "motd", void 0);
    GameSettings = tslib_1.__decorate([
        typeorm_1.Entity()
    ], GameSettings);
    return GameSettings;
}());
exports.GameSettings = GameSettings;
//# sourceMappingURL=GameSettings.entity.js.map