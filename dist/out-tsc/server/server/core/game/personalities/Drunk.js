"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Drunk = /** @class */ (function (_super) {
    tslib_1.__extends(Drunk, _super);
    function Drunk() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Drunk.description = 'You will step around perfectly randomly, as a proper drunk would.';
    Drunk.statMultipliers = {};
    Drunk.toggleOff = [];
    return Drunk;
}(interfaces_1.Personality));
exports.Drunk = Drunk;
//# sourceMappingURL=Drunk.js.map