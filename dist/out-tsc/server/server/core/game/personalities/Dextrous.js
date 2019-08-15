"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _a;
var interfaces_1 = require("../../../../shared/interfaces");
var Dextrous = /** @class */ (function (_super) {
    tslib_1.__extends(Dextrous, _super);
    function Dextrous() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dextrous.description = 'Whenever you find an item that has a DEX that exceeds your own item, you equip it automatically. DEX + 5%.';
    Dextrous.statMultipliers = (_a = {}, _a[interfaces_1.Stat.DEX] = 1.05, _a);
    Dextrous.toggleOff = ['Intelligent', 'Strong', 'Lucky', 'Fortuitous', 'Agile'];
    return Dextrous;
}(interfaces_1.Personality));
exports.Dextrous = Dextrous;
//# sourceMappingURL=Dextrous.js.map