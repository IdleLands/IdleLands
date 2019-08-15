"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Camping = /** @class */ (function (_super) {
    tslib_1.__extends(Camping, _super);
    function Camping() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Camping.description = 'You will take a break and go camping, not moving until you stop.';
    Camping.statMultipliers = {};
    Camping.toggleOff = [];
    return Camping;
}(interfaces_1.Personality));
exports.Camping = Camping;
//# sourceMappingURL=Camping.js.map