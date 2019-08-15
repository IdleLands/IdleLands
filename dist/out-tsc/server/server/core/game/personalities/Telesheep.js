"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Telesheep = /** @class */ (function (_super) {
    tslib_1.__extends(Telesheep, _super);
    function Telesheep() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Telesheep.description = 'When you join a party, you will teleport to the leader. You will follow the leader within 5 tiles.';
    Telesheep.statMultipliers = {};
    Telesheep.toggleOff = [];
    return Telesheep;
}(interfaces_1.Personality));
exports.Telesheep = Telesheep;
//# sourceMappingURL=Telesheep.js.map