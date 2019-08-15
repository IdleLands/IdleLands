"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Indecisive = /** @class */ (function (_super) {
    tslib_1.__extends(Indecisive, _super);
    function Indecisive() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Indecisive.description = 'All incoming choices will have their default action set randomly.';
    Indecisive.toggleOff = ['Affirmer', 'Denier'];
    return Indecisive;
}(interfaces_1.Personality));
exports.Indecisive = Indecisive;
//# sourceMappingURL=Indecisive.js.map