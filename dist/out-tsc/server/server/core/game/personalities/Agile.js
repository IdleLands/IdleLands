"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _a;
var interfaces_1 = require("../../../../shared/interfaces");
var Agile = /** @class */ (function (_super) {
    tslib_1.__extends(Agile, _super);
    function Agile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Agile.description = 'Whenever you find an item that has a AGI that exceeds your own item, you equip it automatically. AGI + 5%.';
    Agile.statMultipliers = (_a = {}, _a[interfaces_1.Stat.AGI] = 1.05, _a);
    Agile.toggleOff = ['Intelligent', 'Strong', 'Lucky', 'Dextrous', 'Fortuitous'];
    return Agile;
}(interfaces_1.Personality));
exports.Agile = Agile;
//# sourceMappingURL=Agile.js.map