"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Affirmer = /** @class */ (function (_super) {
    tslib_1.__extends(Affirmer, _super);
    function Affirmer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Affirmer.description = 'All incoming choices will be set to "Yes" as their default action.';
    Affirmer.toggleOff = ['Denier', 'Indecisive'];
    return Affirmer;
}(interfaces_1.Personality));
exports.Affirmer = Affirmer;
//# sourceMappingURL=Affirmer.js.map