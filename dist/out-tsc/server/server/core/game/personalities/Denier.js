"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Denier = /** @class */ (function (_super) {
    tslib_1.__extends(Denier, _super);
    function Denier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Denier.description = 'All incoming choices will be set to "No" as their default action.';
    Denier.toggleOff = ['Affirmer', 'Indecisive'];
    return Denier;
}(interfaces_1.Personality));
exports.Denier = Denier;
//# sourceMappingURL=Denier.js.map