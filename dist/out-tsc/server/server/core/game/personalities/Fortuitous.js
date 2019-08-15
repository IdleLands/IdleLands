"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _a;
var interfaces_1 = require("../../../../shared/interfaces");
var Fortuitous = /** @class */ (function (_super) {
    tslib_1.__extends(Fortuitous, _super);
    function Fortuitous() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Fortuitous.description = 'Whenever you find an item that has a CON that exceeds your own item, you equip it automatically. CON + 5%.';
    Fortuitous.statMultipliers = (_a = {}, _a[interfaces_1.Stat.CON] = 1.05, _a);
    Fortuitous.toggleOff = ['Intelligent', 'Strong', 'Lucky', 'Dextrous', 'Agile'];
    return Fortuitous;
}(interfaces_1.Personality));
exports.Fortuitous = Fortuitous;
//# sourceMappingURL=Fortuitous.js.map